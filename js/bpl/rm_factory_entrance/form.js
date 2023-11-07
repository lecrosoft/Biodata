const wrapper = document.getElementById('wrapper');


let content = $(
                `
                    <div class="container">
                    <div class="factoryEntrance">
                        Factory Entrance Module
                    </div>
                        <div class="selectTool">
                           <div>
                                <label>User</label>
                                <input type="text" class="form-control"/>
                           </div>
                           <div>
                                <label>Entrance Location</label>
                                <select class="form-control">
                                    <option>Pick Location</option>
                                </select>
                           </div>
                           
                           <div>
                                <label>Date</label>
                                <input type="text" id="date" value=${new Date}  class="form-control"/>
                            </div>
                           
                        </div>
                        <div class="scanner">

                        </div>

                    </div>
                `
)

content.find('#date').datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker( 'setDate');

$(wrapper).html(content)