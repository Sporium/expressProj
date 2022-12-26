#!/bin/sh
docker build . -t dev/express

docker run -p 8000:8000 dev/express
