import matplotlib.pyplot as plt

def shape_functions ( num_element_nodes ):

    # Create xi array
    xi = [ -1 + i * 2. / ( num_element_nodes - 1 )  for i in range( num_element_nodes ) ]

    # Create N and dN arrays
    N = []
    dN = []

    for i in range( num_element_nodes ):

        # Create shape function
        xvals = []

        for j in range( num_element_nodes ):

            if i != j:

                xvals.append( [ xi[ i ], xi[ j ] ] )

        N.append( lambda _xi, _xvals=xvals: reduce( lambda a, b: a*b, [ ( _xi - xval[ 1 ] ) / ( xval[ 0 ] - xval[ 1 ] ) for xval in _xvals ]) )

        # Create derivative of shape function
        mf = []

        for j in range( num_element_nodes ):

            if i != j:

                m = 1.0 / ( xi[ i ] - xi[ j ] )
                f = []

                for k in range( num_element_nodes ):

                    if k != i and k != j:

                        f.append( lambda _xi, _i=xi[ i ], _k=xi[ k ]: ( _xi - _k ) / ( _i - _k ) )

                    else:

                        f.append( lambda _xi: 1.0 )

                mf.append( [ m, f ] )

        dN.append( lambda _xi, _mf=mf: reduce( lambda a,b: a+b, [ __mf[0] * reduce( lambda c,d: c*d, map( lambda e: e(_xi), __mf[1] ) ) for __mf in _mf ] ) )

    return N, dN, xi

def plot_shape_functions ( shape_fns ):

    npoints = 50
    x = [ -1 + i * 2. / ( npoints- 1 )  for i in range( npoints ) ]

    for f in shape_fns:
        plt.plot( x, [ f( i ) for i in x ] )

    plt.show()

def plot_f_df ( f, df ):

    npoints = 50
    x = [ -1 + i * 2. / ( npoints- 1 )  for i in range( npoints ) ]

    plt.plot( x, [ f( i ) for i in x ] )
    plt.plot( x, [ df( i ) for i in x ] )
    plt.show()


# N, dN, xi = shape_functions( 3 )
# plot_shape_functions( N )
# plot_f_df( N[1], dN[1] )

