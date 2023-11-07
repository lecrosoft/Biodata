class Report extends Worker {

	render(data, callback)
	{
        if ( typeof(data) === 'undefined' )
            throw "Missing parameters";

        if (data) {
            try {
                var obj = JSON.parse(data),
                    tab1 = $('#holder1'),
                    tab2 = $('#holder2'),
                    tab3 = $('#holder3'),
                    tab4 = $('#holder4');

                let params =
                    {
                        scrollY: '50vh',
                        scrollCollapse: true,
                        pageLength:  10,
                        aLengthMenu: [10, 15, 20, 25, 50],                           
                        drawCallback: function () {
                            let lastColkey = this.api().columns()[0].length - 1
                            let behindLastKey = lastColkey - 1
                            
                            if ( isNaN(this.api().column( behindLastKey ).data()[0]) )
                                this.api().column( behindLastKey ).footer().innerHTML = this.api().column(  behindLastKey , { search: 'applied' } ).data().count();
                            else
                                this.api().column( behindLastKey ).footer().innerHTML = this.api().column(  behindLastKey , { search: 'applied' } ).data().sum();

                            this.api().column( lastColkey ).footer().innerHTML = this.api().column( lastColkey, {search: 'applied'}).data().sum();
                        }                                          
                    }

                if (obj.status) {
                        /* >>>>>>>>>>>>>>>>>>>>. Tab 1 .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
                        if ( typeof(obj.table1) === 'object' )
                            tab1.html("<p class='w3-margin'>"+obj.table1.empty+"</p>")
                        else {
                            tab1.html(obj.table1)
                                this.tblfooter('holder1', "<tfoot class='table-bordered'><tr><td class='no-border'></td> <td class='no-border'></td> <td class='no-border'>Total</td> <td></td> <td></td></tr> </tfoot>")
                                        this.tblfeatures('holder1', params)
                                            this.tbloptions('holder1')

                            if ( $(obj.table1).hasClass('highlighter') )
                                this.highlightBarcodeDuplicate($(obj.table1).find('tr')[1].cells.length - 2)
                        }
                        /* >>>>>>>>>>>>>>>>>>>>. /end .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


                        /* >>>>>>>>>>>>>>>>>>>>. Tab 2 .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
                        if ( typeof(obj.table2) === 'object' )
                            tab2.html("<p class='w3-margin'>"+obj.table2.empty+"</p>")
                        else {
                            tab2.html(obj.table2)
                                this.tblfooter('holder2', "<tfoot class='table-bordered'><tr><td class='no-border'></td> <td class='no-border'>Total</td> <td></td> <td></td></tr> </tfoot>")
                                        this.tblfeatures('holder2', params)
                                            this.tbloptions('holder2')
                        }                    
                        /* >>>>>>>>>>>>>>>>>>>>. /end .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


                        /* >>>>>>>>>>>>>>>>>>>>. Tab 3 .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
                        if ( typeof(obj.table3) === 'object' )
                            tab3.html("<p class='w3-margin'>"+obj.table3.empty+"</p>")
                        else {
                            delete params.drawCallback
                            params.bSort = false
                            params.info = false
                            //params.paging = false
                            params.searching = false
                            params.scrollX = true
                            params.scroller = { rowHeight: 30 }
                            params.fixedColumns = { leftColumns: 1, rightColumns: 1 }

                            tab3.html(obj.table3)
                                this.tblfeatures('holder3', params)
                                    this.tbloptions('holder3')
                        }                    
                        /* >>>>>>>>>>>>>>>>>>>>. /end .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


                        /* >>>>>>>>>>>>>>>>>>>>. Tab 4 .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
                        if ( typeof(obj.table4) === 'object' )
                            tab4.html("<p class='w3-margin'>"+obj.table4.empty+"</p>")
                        else {
                            params.fixedColumns = { leftColumns: 2 }

                            tab4.html(obj.table4)
                                this.tblfeatures('holder4', params)
                                    this.tbloptions('holder4')
                        }                    
                        /* >>>>>>>>>>>>>>>>>>>>. /end .<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

                        this.content.css('opacity', '1');
                            this.loader.fadeOut(2000);                                    
                } else
                    console.log(obj.message);

                if(callback != null){
                  callback(obj.status)
                }

            } catch(err) {
                console.log('Error message: ', err);
            }            
        } else
            console.log('... Server request failed');		
	}

}