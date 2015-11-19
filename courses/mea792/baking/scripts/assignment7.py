from import_merge import *
from interpolate_dsm import *
from compute_differences import *
from generate_report import *
from terrain_profiles import *

# Variables
workingDir = "/home/tristan/Desktop/assignment7/"
lidar_dsm = 'mid_pines_lidar_dsm'

# Part 1 - Import and merge
merged_las_vector = import_merge( workingDir )

# Part 2 - DSM interpolation with parallelization
interpolate_dsm( merged_las_vector, lidar_dsm )

# Part 3 - Working with large amount of maps
rasters = ['2015_06_20_pix4d_11GCP_dsm', '2015_06_20_DSM_Trimble_11GCP',
           '2015_06_20_DSM_agi_11GCP']
compute_differences( rasters )

# Part 4 - Generate report
generate_report( workingDir )

# Part 5 - Terrain profiles
rasters = ['2015_06_20_pix4d_11GCP_dsm', '2015_06_20_DSM_Trimble_11GCP',
           '2015_06_20_DSM_agi_11GCP', lidar_dsm]
coordinates = [[637160.446919, 219373.236976,
                637105.693795, 219392.416036,
                637072.439779, 219400.613538],
               [636723.722784, 219347.123879,
                637136.495982, 219383.20853],
               [637065.206795, 219731.733448,
                637220.106758, 219475.62044,
                637253.551068, 219309.279002],
               [636955.192616, 219495.863049,
                637001.838628, 219397.290345]]
csv = ['default.csv', 'south_field.csv', 'road.csv', 'tree.csv']
terrain_profiles( rasters, coordinates, csv )
