#!/bin/sh

PYTHONPATH=$PYTHONPATH:./lib/pymaker py.test --cov=cdp_keeper --cov-report=term --cov-append tests/
