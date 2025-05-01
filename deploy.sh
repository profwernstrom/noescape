#!/bin/bash

# Generate data files
python scripts/generate_data.py

# Upload generated data to the server
scp -r ./data noescape.fyi:/var/noescape/

# Build doker image
docker build . -t localhost:32000/noescape:latest

# Create ssh tunnel to the server
ssh -f -N -L 32000:localhost:32000 noescape.fyi

# Push image to the server through the tunnel
docker push localhost:32000/noescape:latest

# Remove the tunnel
pkill -f "ssh -f -N -L 32000"

# Restart the app
ssh noescape.fyi /opt/bin/restart-noescape
