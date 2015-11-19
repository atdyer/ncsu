import os
import grass.script as gscript

def generate_report( workingDir = '.' ):

    # Move to the working directory
    os.chdir( workingDir )

    # get list of rasters we are interested in using a search pattern
    rasters = gscript.list_strings('raster', pattern='2015_06_*')

    # initialize a dictionary to hold statistics for each raster
    stats = {}

    # iterate through the list of rasters
    for raster in rasters:

        # save univariate statistics for raster to dictionary
        stats[raster] = gscript.parse_command('r.univar', map=raster, flags='g')

        # compute shaded relief, use name of the original raster including mapset
        shaded_relief = raster.replace('@', '_') + '_shade'
        gscript.run_command('r.relief', input=raster, output=shaded_relief,
                            overwrite=True)

        gscript.run_command('r.colors', map=raster, color='elevation')

        # render the raster (geographical extent follows current region)
        gscript.run_command('d.mon', start='cairo', output=raster + '.png',
                            width=400, height=400, overwrite=True)
        gscript.run_command('d.shade', shade=shaded_relief, color=raster)
        gscript.run_command('d.mon', stop='cairo')

    template = """&lt;h2&gt;Raster map {name}&lt;/h2&gt;
    &lt;h3&gt;Statistics&lt;/h3&gt;
    &lt;table&gt;
    &lt;tr&gt;&lt;td&gt;Mean&lt;/td&gt;&lt;td&gt;{mean}&lt;/td&gt;
    &lt;tr&gt;&lt;td&gt;Variance&lt;/td&gt;&lt;td&gt;{var}&lt;/td&gt;
    &lt;/table&gt;
    &lt;h3&gt;Image&lt;/h3&gt;
    &lt;img src="{name}.png"&gt;
    """

    # write to a file using a template
    with open('report.html', 'w') as output:
            for raster in sorted(rasters):
                stat = stats[raster]
                output.write(template.format(
                    name=raster, mean=stat['mean'], var=stat['variance']))
