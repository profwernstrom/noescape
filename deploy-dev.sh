#!/bin/bash

# Build doker image
docker build . -t localhost:32000/noescape:dev

# Create ssh tunnel to the server
ssh -f -N -L 32000:localhost:32000 dev.noescape.fyi

# Push image to the server through the tunnel
docker push localhost:32000/noescape:dev

# Remove the tunnel
pkill -f "ssh -f -N -L 32000"

# Restart the app
ssh noescape.fyi /opt/bin/restart-noescape
