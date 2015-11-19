import grass.script as gscript

# Imports multiple las files to GRASS and combines
# them into a single vector named vectorName
#  - lasFiles: list of las files
#  - vectorName: name for combined vector in GRASS
def las_to_vector( lasFiles, vectorName ):

    # Get the current region
    region = gscript.region()

    # List of vectors
    vectors = []

    # Loop through files
    for f in lasFiles:

        # Get the bounding box of the point cloud
        bbox = gscript.read_command( 'r.in.lidar',
            input=f,
            output='foo',
            flags='go'
        ).strip()

        # Parse the bounding box
        bbox = gscript.parse_key_val( bbox,
            vsep=' ',
            val_type=float
        )

        # Ensure that the bounding box of the file overlaps the region
        if ( bbox['n'] < region['s'] or bbox['s'] > region['n'] or
             bbox['e'] < region['w'] or bbox['w'] > region['e']):

            gscript.info( 'Skipping tile %s' % f );
            continue

        # Import the las file as a vector
        name = 'tile_' + f.rsplit( '.', 1 )[0]
        vectors.append( name )

        gscript.run_command( 'v.in.lidar',
            input=f,
            output=name,
            flags='rto',
            class_filter=2
        )

    # Combine all vectors into single vector
    gscript.run_command( 'v.patch',
        input=vectors,
        output=vectorName,
        flags='b',
        overwrite=True
    )

    gscript.run_command( 'g.remove',
        type='vector',
        name=vectors,
        flags='f'
    )
