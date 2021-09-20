window.onload = function(argument) {
    var request = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(cb) {
        return setTimeout(cb, 30)
    };
    w = window.innerWidth, h = window.innerHeight;
    var canvas = document.getElementById('c');
    canvas.width = w, canvas.height = h;
    var c = canvas.getContext("2d"),
        x = 100,
        y = 100,
        pointsObjectArray = [],
        frameCount = 1;
    pointsNumber = 300, mouseCoordinate = [null, null], clickCheck = false;
    window.document.body.onclick = function(argument) {
        mouseCoordinate = [argument.clientX, argument.clientY];
        if (!clickCheck) {
            clickCheck = !clickCheck;
        }
        for (var i = 0; i < pointsNumber; i++) {
            pointsObjectArray[i] = new Point();
        };
        frameCount = 1;
    }
    /* check the number of argument to make sure which dimension we want. (onely 1~3)*/
    var bezierLine = function(bezierPointArray, frame) {
        frame = frame / 400;
        minusT = 1 - frame;
        tempCoordinate = [0, 0];
        switch (bezierPointArray.length) {
            case 2:
                tempCoordinate[0] = minusT * bezierPointArray[0][0] + frame * bezierPointArray[1][0];
                tempCoordinate[1] = minusT * bezierPointArray[0][1] + frame * bezierPointArray[1][1];
                return tempCoordinate;
            case 3:
                tempCoordinate[0] = Math.pow(minusT, 2) * bezierPointArray[0][0] + 2 * minusT * frame * bezierPointArray[1][0] + Math.pow(frame, 2) * bezierPointArray[2][0];
                tempCoordinate[1] = Math.pow(minusT, 2) * bezierPointArray[0][1] + 2 * minusT * frame * bezierPointArray[1][1] + Math.pow(frame, 2) * bezierPointArray[2][1];
                return tempCoordinate;
            case 4:
                tempCoordinate[0] = Math.pow(minusT, 3) * bezierPointArray[0][0] + 3 * bezierPointArray[1][0] * frame * Math.pow(minusT, 2) + 3 * bezierPointArray[2][0] * Math.pow(frame, 2) * minusT + bezierPointArray[3][0] * Math.pow(frame, 3);
                tempCoordinate[1] = Math.pow(minusT, 3) * bezierPointArray[0][1] + 3 * bezierPointArray[1][1] * frame * Math.pow(minusT, 2) + 3 * bezierPointArray[2][1] * Math.pow(frame, 2) * minusT + bezierPointArray[3][1] * Math.pow(frame, 3);
                return tempCoordinate;
        }
    }
    var random = function() {
        tempI = arguments[0];
        return Math.random() * tempI;
    }

    /* start from startPoint, end at endPoint. During the animation, use previousPoint and nextPoint to caculate it.
    	then use bezierPoint 1 and 2 to make the curve.  */
    var Point = function() {
        if (clickCheck) {
            this.startPoint = mouseCoordinate;
            this.endPoint = [mouseCoordinate[0] + 1, mouseCoordinate[1] + 1];
        } else {
            this.startPoint = [null, null];
            this.endPoint = [null, null];
        }
        this.previousPoint = [null, null];
        this.nextPoint = [null, null];
        this.bezierPoint1 = [null, null];
        this.bezierPoint2 = [null, null];
        this.moveCount = 0;
        this.moveCountCheck = 0;
        this.color = null;
        this.lineWidth = random(15);
        this.cap = "round";
        this.speed = 0.4;
    }
    Point.prototype.update = function(frame, whichPoint) {
        if (frame < 2) {
            frame = frame * this.speed;
            if (clickCheck) {} else {
                this.startPoint = [w / 2, h / 2];
                this.endPoint = [w / 2 + 1, h / 2 + 1];
            }
            this.previousPoint = this.startPoint;
            this.bezierPoint1 = [random(w), random(h)];
            this.bezierPoint2 = [random(w), random(h)];
        } else {
            frame = frame * this.speed;
            if (this.previousPoint[0] != this.endPoint[0] || this.previousPoint[1] != this.endPoint[1]) {
                this.nextPoint = bezierLine([this.previousPoint, this.bezierPoint1, this.bezierPoint2, this.endPoint], frame);
                c.beginPath();
                c.moveTo(this.previousPoint[0], this.previousPoint[1]);
                c.lineTo(this.nextPoint[0], this.nextPoint[1]);
                if (this.color) {
                    c.strokeStyle = this.color;
                } else {
                    c.strokeStyle = 'hsla(' + ((frame) * 5) % 360 + ', ' + "100%" + ', ' + random(100).toString() + "%" + ', 1)';
                }
                c.lineWidth = this.lineWidth;
                c.lineCap = this.cap;
                c.stroke();
                this.previousPoint = this.nextPoint;
            } else {
                frameCount = 0;
            }
        }
    };

    function init(pointsNum) {
        for (var i = 0; i < pointsNum; i++) {
            pointsObjectArray[i] = new Point();
        };
    }

    function loop() {
        c.fillStyle = 'rgba(20,20,20,1)';
        c.fillRect(0, 0, w, h);
        for (var i = 0; i < pointsObjectArray.length; i++) {
            pointsObjectArray[i].update(frameCount, i);
        };
        frameCount++;
        window.requestAnimationFrame(loop);
    }
    init(pointsNumber);
    loop();


}