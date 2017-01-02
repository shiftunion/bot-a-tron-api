function asyncmethod(message) {
    return new Promise(function (fullfill, reject) {
        setTimeout(function () {
            console.log(message);
            fullfill();
        }, 500)
    });
}

async function main() {
    await asyncmethod('nick1');
    await asyncmethod('nick2');
    await asyncmethod('nick3').then(asyncmethod('nick4')).then(asyncmethod('nick5')).then(() => {
        setTimeout(function () {
            console.log('nick6');
        }, 5000)
    });
    console.log('nick7')
}

main();