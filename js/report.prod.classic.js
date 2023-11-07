class Report extends Worker {

	render(data)
	{
        if ( typeof(data) === 'undefined' )
            throw "Missing parameters";

        if (data) {
            try {
                var obj = JSON.parse(data);
                console.log('drrrrrr',obj)

                let params =
                    {
                        scrollY: '35vh',
                        scrollCollapse: true,
                        bAutoWidth: false,                              
                        bSort: false,
                        searching: false,
                        paging: false,
                        info: false,
                        drawCallback: function () {
                            if ( isNaN(this.api().column( 2 ).data()[0]) )
                                this.api().column(2).footer().innerHTML = this.api().column( 2 ).data().count();
                            else
                                this.api().column(2).footer().innerHTML = this.api().column( 2 ).data().sum();

                            this.api().column(3).footer().innerHTML = this.api().column( 3 ).data().sum();
                        }                                           
                    }

                if (obj.status) {
                    if ( obj.content === 'daily' ) {
                        this.content.html('<div class="w3-row-padding" style="height: 52vh; overflow: hidden;"><div class="w3-third"> <div id="tableWrap1" class="w3-border"></div> </div> <div class="w3-third"> <div id="tableWrap2" class="w3-border"></div> </div> <div class="w3-third"> <div id="tableWrap3" class="w3-border"></div> </div> </div> <div class="w3-container w3-margin-top"> <div id="tableWrap4" class="w3-border"></div> </div>')
            
                        var wrap1 = $('#tableWrap1'),
                            
                            wrap3 = $('#tableWrap3'),
                            wrap4 = $('#tableWrap4'),
                            tfoot = '<tfoot><tr><td class="no-border"></td> <td class="no-border">Total</td> <td></td> <td></td></tr> </tfoot>';

                        /* >>>>>>>>>>>>>>>>>>>>. 1 .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
                        if ( typeof(obj.table1) === 'object' )
                            wrap1.html("<p class='w3-margin'>"+obj.table1.empty+"</p>");
                        else {
                            wrap1.html(obj.table1);
                                this.tblfooter('tableWrap1', tfoot)
                                    this.tblfeatures('tableWrap1', params)
                        }
                        /* >>>>>>>>>>>>>>>>>>>>. /end .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


                        /* >>>>>>>>>>>>>>>>>>>>. 2 .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
                        // if ( typeof(obj.table2) === 'object' )
                        //     wrap2.html("<p class='w3-margin'>"+obj.table2.empty+"</p>");
                        // else {
                        //     wrap2.html(obj.table2);
                        //         this.tblfooter('tableWrap2', tfoot)
                        //             this.tblfeatures('tableWrap2', params)
                        // }                    
                        /* >>>>>>>>>>>>>>>>>>>>. /end .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


                        /* >>>>>>>>>>>>>>>>>>>>. 3 .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
                        if ( typeof(obj.table3) === 'object' )
                            wrap3.html("<p class='w3-margin'>"+obj.table3.empty+"</p>");
                        else {
                            wrap3.html(obj.table3);
                                this.tblfooter('tableWrap3', tfoot)
                                    this.tblfeatures('tableWrap3', params)
                        }                    
                        /* >>>>>>>>>>>>>>>>>>>>. /end .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


                        /* >>>>>>>>>>>>>>>>>>>>. 4 .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
                        if ( typeof(obj.table4) === 'object' )
                            wrap4.html("<p class='w3-margin'>"+obj.table4.empty+"</p>");
                        else {
                            wrap4.html(obj.table4);
                        }                    
                        /* >>>>>>>>>>>>>>>>>>>>. /end .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

                        this.content.css('opacity', '1');
                            this.loader.fadeOut(2000);                        
                    } else if ( obj.content === 'calendar' ) {
                        if ( typeof(obj.calendar) === 'object' ) {
                            this.content.html("<p class='w3-margin'>"+obj.calendar.empty+"</p>");
                                this.content.css('opacity', '1')
                        }
                        else {
                            delete params.drawCallback
                                delete params.scrollY

                            this.content.html(obj.calendar)
                                this.tblfeatures('calendar', params)
                                    this.autoWidth([{'key': 1, 'pixel': 100}, {'key': 2, 'pixel': 50}])
                                        $('#calendarTotal').addClass('max-width')
                                            this.content.css('opacity', '1')
                        }

                        this.loader.fadeOut(2000); 
                    } else {
                        if ( typeof(obj.calendar) === 'object' ) {
                            this.content.html("<p class='w3-margin'>"+obj.calendar.empty+"</p>")
                                this.content.css('opacity', '1')
                        }
                        else {
                            delete params.drawCallback
                                delete params.scrollY

                            this.content.html(obj.calendar)
                                this.tblfeatures('calendar', params)
                                    this.autoWidth([{'key': 1, 'pixel': 240}, {'key': 2, 'pixel': 110}])
                                        $('#calendarTotal').addClass('max-width')
                                            this.content.css('opacity', '1')
                        }

                        this.loader.fadeOut(2000); 
                    }                                        
                } else
                    console.log(obj.message);

            } catch(err) {
                console.log('Unsupported file received from request: ', err);
            }            
        } else
            console.log('... Server request failed');		
	}

    manipulator()
    {
        $('.shutter-panel-collapse').removeClass('show').slideUp(1000, function() {
            $('.fa-spinner').fadeIn(1000, function(){
                $('#content').css('opacity', '0')
                    request(searchdata)
                        varUpdate(searchdata)
            })                    
        })
    }

}