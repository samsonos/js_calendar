/**
 * Created by omelchenko on 10.10.2014.
 */

var SamsonJSCalendar =
{
    sjscalendar : function(name, parametrs){

        //if (this.length)
        //{
        //this.each(function(obj){
        var obj = this;
        var tDate = new Date();
        var tDay = tDate.getDate();
        var tMonth = tDate.getMonth();
        var tYear = tDate.getFullYear();
        var prevDate = false;


        if(!parametrs) parametrs = {};
        var multi = parametrs.multi ? parametrs.multi : false;
        var prevSelected = parametrs.selected ? parametrs.selected : new Array();
        var minToday = parametrs.mintoday ? parametrs.mintoday : false;
        var minDate = parametrs.mindate ? new Date(Date.parse(parametrs.mindate)) : false;
        var clickHandler = parametrs.clickHandler ? parametrs.clickHandler : undefined;
        var minMonth = false;
        if(minDate){
            minMonth = Date.parse(minDate.getFullYear()+'/'+(minDate.getMonth()+1)+'/'+01);
            minDate = minDate.getTime();
        }
        var selected = {};
        var monthName={
            0:'Январь',
            1:'Февраль',
            2:'Март',
            3:'Апрель',
            4:'Май',
            5:'Июнь',
            6:'Июль',
            7:'Августь',
            8:'Сеньтябрь',
            9:'Октябрь',
            10:'Ноябрь',
            11:'Декабрь'
        };

        var cYear = tYear;
        var cMonth = tMonth;
        var created = false;

        var table = s('<div class="sjs-calendar"></div>');
        var tableRow = new Array();
        var tableArray = new Array();
        var header = s('<div class="sjs-c-header"></div>');
        header.append(s('<div class="sjs-c-left-arrow"></div>'));
        var monthHeader = s('<div class="sj-c-month"></div>');
        header.append(monthHeader);
        header.append(s('<div class="sjs-c-right-arrow"></div>'));
        table.append(header);
        monthHeader.html(monthName[cMonth]+', '+cYear);

        table.append(s('<ul class="sjs-c-week-header"><li>пн</li><li>вт</li><li>ср</li><li>чт</li><li>пт</li><li>сб</li><li>вс</li></ul>'));

        for (var i = 0; i <= 5; i++) {
            tableRow[i] = s('<ul></ul>');
            tableArray[i] = new Array();

            for (var j = 0; j < 7; j++) {
                tableArray[i][j] = s('<li day=""></li>');
                tableArray[i][j].css('display', 'inline-block');
                tableArray[i][j].addClass('day-btn');
                tableRow[i].append(tableArray[i][j]);
            }
            table.append(tableRow[i]);
        }

        var getMaxDate = function(y, m) {
            if (m == 1) {
                return y%4 || (!(y%100) && y%400 ) ? 28 : 29;
            }
            return m===3 || m===5 || m===8 || m===10 ? 30 : 31;
        };

        var fillTable = function(y, m) {
            var fDate = new Date(y, m);
            sMonth = m+1;
            if (sMonth<10) sMonth = '0'+sMonth;
            var fDay = fDate.getDay() - 1;
            if (fDay < 0) fDay = 6;
            var maxDate = getMaxDate(y, m);
            var day = 1;
            var activeRow = false;
            for (var i = 0; i < 6; i++) {
                activeRow = false;
                for (var j = 0; j < 7; j++) {
                    if (day<=maxDate) {
                        if (!((i==0)&&(j<fDay))) {
                            sDay = day;
                            if(day<10) sDay = '0'+sDay;
                            tableArray[i][j].a('day', sDay);
                            if (!selected[y+'-'+sMonth+'-'+sDay]){
                                tableArray[i][j].removeClass('selected');
                            } else {
                                tableArray[i][j].addClass('selected');
                                prevDate = tableArray[i][j];
                            }
                            if((day == tDay)&&(m == tMonth)&&(y == tYear)){
                                tableArray[i][j].addClass('today');
                            }
                            else tableArray[i][j].removeClass('today');
                            if(prevSelected.indexOf(y+'-'+sMonth+'-'+sDay)!=-1) tableArray[i][j].addClass('active');
                            else tableArray[i][j].removeClass('active');
                            tableArray[i][j].html(day++);
                            activeRow = true;
                        } else {
                            tableArray[i][j].a('day', 0);
                            tableArray[i][j].html('');
                            tableArray[i][j].removeClass('selected');
                        }
                    } else {
                        tableArray[i][j].a('day', 0);
                        tableArray[i][j].html('');
                    }
                }
                if(activeRow) tableRow[i].css('display', 'block');
                else tableRow[i].css('display', 'none');
            }
        };
        s('input', obj).each(function(input){
            if(input.is('INPUT')) selected[input.val()] = input;
        });

        this.clearTable = function(date){
            prevSelected = new Array(date);
            fillTable(tYear, tMonth);
        };

        fillTable(cYear, cMonth);

        obj.append(table);
        s('.day-btn', table).click(function(cBtn){
            var day = cBtn.a('day');
            var sMonth = cMonth+1;
            if (sMonth<10) sMonth = '0'+sMonth;
            var key = cYear+'-'+sMonth+'-'+day;


            if (( !minToday || (Date.parse(cYear+'/'+(cMonth+1)+'/'+day)>=Date.parse(tYear+'/'+(tMonth+1)+'/'+tDay)))
                &&( !minDate || (Date.parse(cYear+'/'+(cMonth+1)+'/'+day)>=minDate)) )
            {
                if (selected[key]){
                    selected[key].remove();
                    cBtn.removeClass('selected');
                    selected[key] = false;
                } else {
                    if(!multi){
                        for (var k in selected) {
                            if(selected[k]){
                                selected[k].remove();
                                selected[k] = false;
                            }
                        }
                        if (prevDate) prevDate.removeClass('selected');
                    }
                    prevDate = cBtn;

                    var input = s('<input type="hidden" name="'+name+'[]" value="'+cYear+'-'+sMonth+'-'+day+'">');
                    selected[key] = input;
                    obj.append(input);
                    cBtn.addClass('selected');
                    if (clickHandler) clickHandler(cBtn, day, sMonth, cYear);
                }

                // Call click event handler
                if(parametrs.click)parametrs.click(selected, day);
            }
        });

        s('.sjs-c-right-arrow',table).click(function(){
            cMonth++;
            if(cMonth > 11) {
                cMonth = 0;
                cYear++;
            }
            monthHeader.html(monthName[cMonth]+', '+cYear);
            fillTable(cYear, cMonth);
        });

        s('.sjs-c-left-arrow',table).click(function(){
            var tempMonth = cMonth;
            var tempYear = cYear;
            tempMonth--;
            if(tempMonth < 0) {
                tempMonth = 11;
                tempYear--;
            }
            if (minToday) {
                if (Date.parse(cYear+'/'+(cMonth+1)+'/01')<=Date.parse(tYear+'/'+(tMonth+1)+'/01')) {
                    tempMonth = cMonth;
                    tempYear = cYear;
                }
            } else if (minDate) {
                if (Date.parse(cYear+'/'+(cMonth+1)+'/01')<=minMonth) {
                    tempMonth = cMonth;
                    tempYear = cYear;
                }
            }
            cMonth = tempMonth;
            cYear = tempYear;
            monthHeader.html(monthName[cMonth]+', '+cYear);
            fillTable(cYear, cMonth);
        });
        //});
        //}
        return this;
    }
};
//Добавим плагин к SamsonJS
SamsonJS.extend( SamsonJSCalendar );