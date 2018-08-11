var UIController = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputValue: '.add__value',
        inputDescription: '.add__description',
        inputDate: '.add__date',
        incomeContainer: '.income__list',
        expenseContainer: '.expense__list',
        calendarContainer: '.calendar',
        container: '.transaction__container',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        //percentageLabel: '.budget__expenses--percentage',
        deleteBtn: '.item__delete--btn',
    }

    var monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var weekArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    var appDate ={
        month: '8',
        day: '01',
        year: '2018'
    };

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

    var getAppDate = function() {
        
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
                    html += '<td class="" id="' + element + '">' + element + '</td>';
                }
            });
            
            html += '</tr><tr>';
            return html ;            
    };

    var addWeek = function(thisWeek, lastWeek) {

        var html;
        html = '';

        for(var i = 0; i < 7; i++) {
            var e = 1;
            thisWeek.push(lastWeek[6] + e + i);
            html += '<td class="" id="' + (lastWeek[6] + e + i) + '">' + thisWeek[i] + '</td>';
            
        }
        

        html += '</tr><tr>';
        return html;
    };

    updateCurrentDate = function(currentDate) {
        var selector;
        selector =  currentDate;

        document.getElementById(selector).classList.toggle('current-day');
    }; 
    

    var finalWeek = function(startDate, monthNumber) {
        var html, e, stop, element;
        html = '';
        e = 0;
        stop = month[monthArr[monthNumber]];

        for(var i = (startDate + 1); i <= stop; i++) {
            week.five.push(i);
            html += '<td class="" id="' + (week.five[e]) + '">' + week.five[e] + '</td>';
            e++;
        }

        element = 7 - week.five.length;
        if(element > 0){
            for(var i = week.five.length; i < 7; i++) {
            week.five.push(element);
            html += '<td class="next-month">' + element + '</td>';
            }
        }

        html += '</tr></tbody></table>';

        return html;
    };

    var formatNumber = function(number, type) {
        /* +/- depending on type
        exactly 2 decimal points
        comma separating thousands
        2310.4654 -> 2310.46
        2000 -> 2,000 */
        var numSplit, int, decimal;

        number = Math.abs(number);
        number = number.toFixed(2);

        numSplit = number.split('.');

        int = numSplit[0];
        decimal = numSplit[1];

        if (int.length > 6 ){
            int = int.substr(0, int.length - 6 ) + '\,' + int.substr(int.length - 6, 6);
        } else if (int.length > 3){
            int = int.substr(0, int.length - 3 ) + '\,' + int.substr(int.length - 3, 3);
        }

        return (type === 'income' ? '+' : '-') + ' '  + int + '.' + decimal;
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

        updateCalendar: function (date) {
            var currentDate, currentDay, currentMonth, currentYear, startDate, html;

            currentDate = date.getDate();
            currentMonth = date.getMonth();
            currentYear = date.getFullYear();

            startDate = new Date( currentYear + '-' + (currentMonth+1) + '-01');

            // make header
            html = '<div class="cal_header"><a href="#">&lt;</a><h2>  %month%</h2><h2> %year%  </h2><a href="#">  &gt;</a></div><table><thead><tr><td>Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td></tr></thead><tbody><tr>';

            html = html.replace('%month%', monthArr[currentMonth]);
            html = html.replace('%year%', (currentYear.toString()));

            // make week 1 html
            html += weekOne(startDate.getDay(), currentMonth);

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
                html += addWeek(thisWeek, lastWeek);
            }
            // make week 5 html
            html += finalWeek(week.four[6], currentMonth);
            element = DOMStrings.calendarContainer;
            document.querySelector(element).insertAdjacentHTML('beforeend', html);

            updateCurrentDate(currentDate);

        },

        displayBudget: function(obj) {

            var type;

            obj.budget > 0 ? type = 'income' :  type = 'expense';

            console.log(obj.budget);
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            //document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, type);
            //document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, type);
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
        this.date = date.getDate;
        this.month = date.getMonth;
        this.year = date.getFullYear;
    };

    var Expense = function(id, description, value, date){
        this.id = id;
        this.description = description;
        this.value = value;
        this.date = date.getDate;
        this.month = date.getMonth;
        this.year = date.getFullYear;
    };

    var calculateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach( function(element){
            sum += element.value;
        });

        data.totals[type] = sum
    };

    return {

        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('income');
            calculateTotal('expense');

            // calc budget: income - expenses
            data.budget = data.totals.income - data.totals.expense;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.income,
                totalExp: data.totals.expense,
                percentage: data.percentage
            }
        },

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
        //document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() {
        var budget;

        // calculate budget
        budgetCtrl.calculateBudget();
    
        // return the budget
        budget = budgetCtrl.getBudget();

        // display budget on UI
        console.log(budget);
        UICtrl.displayBudget(budget);
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
    // 3. update budget
    updateBudget();

    // 4. update UI

    }

    // Initialize
    return {
        init: function() {
            console.log('Application has started');

            // set up event listeners for input 
            setupEventListener();

            // initialize calendar
            var today = new Date(Date.now());
            UICtrl.updateCalendar(today);

            // initialize budget

            // initialize UI
        }
    }

}) (budgetController, UIController);


controller.init();