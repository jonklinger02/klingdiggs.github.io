var UIController = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputValue: '.add__value',
        inputDescription: '.add__description',
        inputDate: '.add__date',
        incomeContainer: '.income__list',
        expenseContainer: '.expense__list'
    }

    var monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var weekArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    var week = {
        one: [],
        two: [],
        three: [],
        four: [],
        five: []
    };

    var month = {
        January: 31, 
        February: 28, 
        March: 31,
        April: 30,
        May: 31,
        June: 30,
        July: 31,
        August: 31,
        September: 30,
        October: 31,
        November: 30,
        December: 31
    };

    var weekOne = function(day, monthNumber){

        var monthLength, calStart, html;

        monthLength = month[monthArr[monthNumber]];

        calStart = monthLength - day + 1;

        if( (7-day) > 0 ){
            var element = 0
            for( var i = calStart; i <= monthLength; i++) {
                week.one.push(i);   
                element++;
            }
            var e = 1;
            for( var i = element; i <= 6; i++){
                    week.one.push(e);
                    e++;
                }
            } else {
                for(var i = 0; i < 7; i++){
                    week.one.push(i + 1);
                }
            }

            html = '';

            week.one.forEach(function(element){

                if (element > 7) {
                    html += '<td class="prev-month">' + element + '</td>';
                } else {
                    html += '<td>' + element + '</td>';
                }
            });
            
            html += '</tr><tr>';
            return html ;            
    };

    var addWeek = function(today, thisWeek, lastWeek) {

        var html;
        html = '';

        for(var i = 0; i < 7; i++) {
            var e = 1;
            thisWeek.push(lastWeek[6] + e + i);
            if(today === thisWeek[i]) {
                html += '<td class="current-day">' + thisWeek[i] + '</td>';
            } else {
                html += '<td>' + thisWeek[i] + '</td>';
            }
        }
        
        console.log(week.two);
        html += '</tr><tr>';
        console.log(html);
        return html;
    };

    return {

        getDOMStrings: function() {
            return DOMStrings;
        },

        clearFields: function(){
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ' ,'  + DOMStrings.inputValue + ' ,' + DOMStrings.inputDate);
            
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach( function(currentValue) {
                currentValue.value = "";
            });

            fieldsArray[0].focus();
        },

        addItem: function(item, type){
            var html, element;

            // create placeholder HTML text
            if (type === 'income'){
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn">x</button></div></div></div>';
            } else {
                element = DOMStrings.expenseContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn">x</button></div></div></div>';
            }

            // replace placeholder text with item.%property%
            html = html.replace('%id%', item.id);
            html = html.replace('%description%', item.description);
            html = html.replace('%value%', item.value );

            // insert into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        initCalendar: function (date) {
            var currentDate, currentDay, currentMonth, currentYear, startDate, html;

            currentDate = date.getDate();
            currentDay = date.getDay();
            currentMonth = date.getMonth();
            currentYear = date.getFullYear();

            startDate = new Date( currentYear + '-' + (currentMonth+1) + '-01');

            // make header
            html = '<div class="cal_header"><a href="#">&lt;</a><h2>%month%</h2><h2>%year%</h2><a href="#">&gt;</a></div><table><thead><tr><td>Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td></tr></thead><tbody><tr>';

            html = html.replace('%month%', monthArr[currentMonth]);
            html = html.replace('%year%', (currentYear.toString()));

            // make week 1 html
            html += weekOne(currentDay, currentMonth);

            // make weeks 2-4 html
            for(var i = 2; i < 5; i++){
                
                if (i === 2){
                    thisWeek = week.two;
                    lastWeek = week.one;
                } else if (i === 3) {
                    thisWeek = week.three;
                    lastWeek = week.two;
                } else {
                    thisWeek = week.four;
                    lastWeek = week.three;
                }
                html += addWeek(currentDate, thisWeek, lastWeek);
            }
            // make week 5 html




        },
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
                date: document.querySelector(DOMStrings.inputDate).value,
            }
        }

    }

}) ();

var budgetController = (function() {

    var data = {
        allItems: {
            expense: [],
            income: []
        },

        totals: {
            expense: 0,
            income: 0
        },

        budget: 0,
    };

    var Income = function(id, description, value, date){
        this.id = id;
        this.description = description;
        this.value = value;
        this.date = date;
    };

    var Expense = function(id, description, value, date){
        this.id = id;
        this.description = description;
        this.value = value;
        this.date = date;
    };

    return {
        addItem: function(type, description, value, date){
            var id, dataArr, newItem;

            dataArr = data.allItems[type];

            if (dataArr.length > 0){
                id = dataArr[dataArr.length - 1].id + 1;
            } else{
                id = 0;
            }

            if (type === 'expense'){
                newItem = new Expense(id, description, value, date);
            } else {
                newItem = new Income(id, description, value, date);
            }

            dataArr.push(newItem);

            return newItem;
        }



    }
}) ();

var controller = (function(budgetCtrl, UICtrl) {

    // 1. intialize with init function
    var DOM = UICtrl.getDOMStrings();



    // 2. add events/budget items
    var setupEventListener = function() {

        document.addEventListener('keypress', function(event) {
            
            if ( event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function() {

        var input, newItem;
        
        // get input from UI
        input = UICtrl.getInput();

        console.log(input);

        if (input.description !== '' &&  !isNaN(input.value) && input.value > 0 && input.date !== ''){
            // send input to budget
            newItem = budgetCtrl.addItem(input.type, input.description, input.value, input.date);

            // update UI and clear fields
            UICtrl.addItem(newItem, input.type);
            UICtrl.clearFields();

        }

    }

    // 3. update budget

    // 4. update UI

    // Initialize
    return {
        init: function() {
            console.log('Application has started');

            // set up event listeners for input 
            setupEventListener();

            // initialize calendar
            var today = new Date(Date.now());
            UICtrl.initCalendar(today);

            // initialize budget

            // initialize UI
        }
    }

}) (budgetController, UIController);


controller.init();