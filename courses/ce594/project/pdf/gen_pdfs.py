import os

# Don't forget to comment out any letter spacing in the css files
os.system( 'wkhtmltopdf ../index.html project.pdf')
os.system( 'wkhtmltopdf ../shape_functions.html code_shape_functions.pdf' )
os.system( 'wkhtmltopdf ../project.html code_project.pdf' )
os.system( 'wkhtmltopdf ../jacobian.html code_jacobian.pdf' )
os.system( 'wkhtmltopdf ../fe.html code_fe.pdf')
os.system( 'pdftk project.pdf written_project.pdf code_project.pdf code_fe.pdf code_jacobian.pdf code_shape_functions.pdf cat output dyer_final_project.pdf')