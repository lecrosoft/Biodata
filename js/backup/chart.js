class gdsChart {

	constructor ( canvas )
	{
		this.canvas = getCanvas(canvas);
        this.chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };
	}

    render ( args = {} ) {
        let def = {
            type: 'bar',
            options: {}             
        }

        let config = { ...def, ...args };
            config.options.responsive = true;
            config.options.maintainAspectRatio = false;
            
        try {
            let chartObj = new Chart(this.canvas, config);

            return chartObj;
        } catch (err) {
            console.error(err);
        }   
    }

}

function getCanvas ( str ) {
    if ( typeof(str) === 'undefined' ) throw "Missing parameters";

    if ( typeof(str) !== 'string' ) throw new TypeError(`String data type expected, ${typeof(str)} given`);

    let element = document.getElementById(str)
        if ( element === null ) throw "Element not found in document";

        if ( element.nodeName !== 'CANVAS' ) throw new TypeError(`CANVAS is expected, ${element.nodeName} given`);

    return element.getContext('2d');
}
