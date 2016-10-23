# web-gui

## Dependencies
rosbridge_suite
sudo apt-get install ros-jade-rosbridge-suite

## Use
### Insecure mode
roslaunch rosbridge_server rosbridge_websocket.launch ssl:=false
Then go to http://localhost/YOUR_PATH_TO_REPO/rosbridge.html
