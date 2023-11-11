console.clear();

function Task(description,cost){

    if(new.target === undefined){ 
        throw new Error('You can\'t call Task without new');
    }

    const _id ="id" + Math.random().toString(16).slice(2);
    const _description = description;
    const _cost = cost;
    
    Object.defineProperty(this,'id',{
        get(){
            return _id;
        }
    });

    Object.defineProperty(this,'description',{
        get(){
            return _description;
        }
    });

    Object.defineProperty(this,'cost',{
        get(){
            return _cost;
        }
    });

};

class IncomeTask extends Task{
    #dotask

    constructor(description,cost){

        if(new.target === undefined){ 
            throw new Error('You can\'t call Task without new');
        }

        super(description,cost);
        this.#dotask = false;

        Object.defineProperty(this,'doTask',{
            get(){
                return this.#dotask;
            },
            set(doTask){
                this.#dotask = doTask;
            }
        });
    }

    makedone(budget){
        budget.income += this.cost;
        this.#dotask = true;
    }

    makeUndone(budget){
        if(this.#dotask !== false) budget.income -=this.cost;
        
        this.#dotask = false;
    }
};

class ExpenseTask extends Task{
    #dotask

    constructor(description,cost){

        if(new.target === undefined){ 
            throw new Error('You can\'t call Task without new');
        }

        super(description,cost);
        this.#dotask = false;

        Object.defineProperty(this,'doTask',{
            get(){
                return this.#dotask;
            },
            set(doTask){
                this.#dotask = doTask;
            }
        });
    }
    

    makedone(budget){
        budget.expenses+=this.cost;
        this.#dotask = true;
    }

    makeUndone(budget){
        if(this.#dotask !== false) budget.expenses -=this.cost;
        this.#dotask = false;
    }
}

class TasksController{
    #tasks = [];

    constructor(){
        if(new.target === undefined){ 
            throw new Error('You can\'t call Task without new');
        }
    }

    addTasks(...tasks){
        let hasThisId = true;

        for(let i=0;i<tasks.length;++i){
            for(let j=0;j<this.#tasks.length;++j){
                if(tasks[i].id===this.#tasks[j].id){
                    hasThisId = false;
                }
               
            }
            if(hasThisId){
                this.#tasks.push(tasks[i]);
            }
            hasThisId = true
        }
    }

    deleteTask(task){
        const indexOfTask = this.#tasks.indexOf(task);
        
        if(indexOfTask !==-1){
            this.#tasks.splice(indexOfTask,1);
            return
        }
        if(indexOfTask ===-1){
            console.log(`Task ${task.id} isn't recognized`);
            return;
        }
    }

    getTasks(){
        return this.#tasks;
    }

    getTasksSortedBy(arg){
        if(arg === 'description'){
            return [...this.#tasks].sort(function(a, b) {
                const description1 = a.description;
                const description2 = b.description;

                const description1InLowerCase = description1.toLowerCase();
                const description2InLowerCase = description2.toLowerCase();

                if (description1InLowerCase > description2InLowerCase) return 1;
                if (description1InLowerCase < description2InLowerCase) return -1;

                if (description1 > description2) return 1;
                if (description1 < description2) return -1;
                return 0;
            });
        }

        else if(arg === 'cost'){
            return this.#tasks.sort(function(a,b){
                if(a.cost>b.cost) return -1;
                if(a.cost<b.cost) return 1;

                return 0;
            });
        }

        else if(arg === 'status'){
            return this.#tasks.sort(function(a,b){
                return -(Number(a.doTask) - Number(b.doTask));

            });
        }
    }

    getFilteredTasks(obj){
        return this.#tasks.filter(function(task){
            if(obj.description!==undefined && obj.isIncome !==undefined && obj.isCompleted !==undefined){
                return (
                    task.description.toLowerCase().includes(obj.description.toLowerCase()) &&
                    taks instanceof IncomeTask === obj.isIncome &&
                    task.doTask === obj.isCompleted
                );
            }
            else if(obj.description!==undefined && obj.isIncome !==undefined && obj.isCompleted ===undefined){
                return (
                    task.description.toLowerCase().includes(obj.description.toLowerCase()) &&
                    task instanceof IncomeTask === obj.isIncome 
                );
            }
            else if(obj.description!==undefined && obj.isIncome ===undefined && obj.isCompleted !==undefined){
                return (
                    task.description.toLowerCase().includes(obj.description.toLowerCase()) &&
                    task.doTask === obj.isCompleted 
                );
            }
            else if(obj.description===undefined && obj.isIncome !==undefined && obj.isCompleted !==undefined){
                return (
                    task instanceof IncomeTask === obj.isIncome &&
                    task.doTask === obj.isCompleted
                );
            }
            else if(obj.description!==undefined && obj.isIncome ===undefined && obj.isCompleted ===undefined){
                return (
                    task.description.toLowerCase().includes(obj.description.toLowerCase()) 
                );
            }
            else if(obj.description === undefined && obj.isIncome !==undefined && obj.isCompleted ===undefined){
                return (
                    task instanceof IncomeTask === obj.isIncome 
                );
            }
            else if(obj.description === undefined && obj.isIncome ===undefined && obj.isCompleted !==undefined){
                return (
                    task.doTask === obj.isCompleted
                );
            }
        })
    }
}

class BudgetController{
    #taskController;
    #budget = {} ;


    constructor(balance){

        if(new.target === undefined){ 
            throw new Error('You can\'t call Task without new');
        }

        this.#taskController = new TasksController();
        this.#budget.balance = balance;
        this.#budget.income = 0;
        this.#budget.expenses = 0;
    }

    get taskController (){
        return this.#taskController
    }

    get budget(){
        return this.#budget;
    }

    get balance(){
        return this.#budget.balance;
    }

    get income(){
        return this.#budget.income;
    }

    get expenses(){
        return this.#budget.expenses;
    }
    
    calcaluteBalance(){
        return this.#budget.balance+this.#budget.income-this.#budget.expenses
    }

    getTasks(){
        return this.#taskController.getTasks()
    }

    addTasks(...tasks){
        this.#taskController.addTasks(...tasks)
    }

    deleteTask (task){
        if(task.doTask===true){
            task.makeUndone(this.#budget);
        }

        this.#taskController.deleteTask(task);
    }

    doneTask(task){
        const indexOfTask = this.getTasks().indexOf(task);
        if(indexOfTask ===-1){
            console.log(`Task ${task.id} isn't recognized`);
            return;
        }
        if(task.doTask === true){
            console.log('Task is already done');
           
        }
        if(task.doTask === false){
            task.makedone(this.#budget);
        }
    }

    unDoneTask(task){
        const indexOfTask = this.getTasks().indexOf(task);
        if(indexOfTask ===-1){
            console.log(`Task ${task.id} isn't recognized`);
            return;
        }
        if(task.doTask === false){
            console.log(`Task isn't done before`);
            return;
        }
        if(task.doTask === true){
            task.makeUndone(this.#budget);
        }
    }
}




const budgetController = new BudgetController(100);

const task1 = new IncomeTask('sold car',2000);
const task2 = new ExpenseTask('buy food',50);
const task3 = new IncomeTask('sold phone',100);
const task4 = new ExpenseTask('buy PS5',400);

budgetController.addTasks(task1,task2,task3,task4);

console.log(budgetController.getTasks());

console.log(budgetController.balance)
console.log(budgetController.income)
console.log(budgetController.expenses)

// task1.makedone(budgetController.budget);

budgetController.unDoneTask(task2)

console.log(budgetController.balance)
console.log(budgetController.income)
console.log(budgetController.expenses)

// obj = {
//     isCompleted :true
// }

// console.log(budgetController.taskController.getFilteredTasks(obj)[0].cost)