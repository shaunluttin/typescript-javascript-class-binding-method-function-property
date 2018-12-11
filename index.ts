const getStdin = () => {

    const stdin = process.stdin;

    if (stdin && stdin.setRawMode) {
        stdin.setRawMode(true);
    }

    // resume stdin in the parent process (node app won't quit all by itself
    // unless an error or process.exit() happens)
    stdin.resume();

    // i don't want binary, do you?
    stdin.setEncoding('utf8');

    // on any data into stdin
    stdin.on('data', function (key) {
        // ctrl-c ( end of text )
        if (key === '\u0003') {
            process.exit();
        }
    });

    return stdin;
};

class SomeClass {

    public someState: string;

    constructor() {

        this.someState = "someStateValue";

        console.log('Press any key to see the output.')

        // why?
        // someMethod acts like a function; binding depending on the context when its called
        // someFunc is an arrow function; binding dependings on the context when its defined
        getStdin()
            .on('data', this.someMethod) // undefined
            .on('data', this.someFunc) // defined

        // why?
        // someMethod act the same as before, but it is called from an arrow function
        // someFunc acts the same as before
        getStdin()
            .on('data', () => this.someMethod()) // defined
            .on('data', () => this.someFunc()) // defined

        // why?
        // we manually bind both in the defining context
        getStdin()
            .on('data', this.someMethod.bind(this)) // defined
            .on('data', this.someFunc.bind(this)) // defined

        // see also
        // https://stackoverflow.com/a/20279485/1108891
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
    }

    someMethod() {
        console.log('someMethod:' + this.someState);
    }

    someFunc = () => {
        console.log('someFunc:' + this.someState);
    }
}

const someClass = new SomeClass();