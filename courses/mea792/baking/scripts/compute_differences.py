import grass.script as gscript

# Computes the differences between every
# combination of rasters in the given list
def compute_differences( raster_list ):

    # Set the region to the first raster in the list
    gscript.run_command( 'g.region', rast=raster_list[0] )

    # Outer loop
    for a in raster_list:

        # Inner loop
        for b in raster_list:

            # No need to calculate difference between a raster and itself
            if a == b:

                continue

            # Create the name for the difference raster
            difference = 'diff_{ra}_{rb}'.format( ra = a.replace( '@', '_' ),
                                                  rb = b.replace( '@', '_' ))

            # Compute differences using r.mapcalc
            gscript.mapcalc( '{diff} = {ra} - {rb}'.format( ra = a,
                                                            rb = b,
                                                            diff = difference))

            # Set the color table
            gscript.run_command( 'r.colors',
                map = difference,
                color = 'differences',
                flags = 'e'
            )
