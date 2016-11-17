import matplotlib.pyplot as plt

tplot = []
dplot = []

L = 1.0

K = 4.0/L
M = L/3.0
F = L/2.0

alpha = 0
dt = 1/6.0

# Step 1: Initialize at time zero
d = 0.0
v = ( F - K*d ) / M

t = 0
ts = 100 * dt
while t < ts:

    tplot.append( t )
    dplot.append( d )

    predictor = d + ( 1-alpha ) * dt * v

    vnext = ( F - K*predictor ) / ( M + alpha*dt*K )

    dnext = predictor + alpha * dt * vnext

    # Advance timestep
    v = vnext
    d = dnext
    t += dt

print d

plt.plot( tplot, dplot )
plt.show()