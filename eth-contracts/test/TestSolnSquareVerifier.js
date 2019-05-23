var Verifier = artifacts.require('Verifier');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var proof39 = require('../../zokrates/code/square/proof39.json');
var proof24 = require('../../zokrates/code/square/proof24.json');

contract('Verifier', accounts => {
    const owner = accounts[0];
    const acc_1 = accounts[1];

    describe('testing Verifier + ERC721 integration works', function () {
        before(async function () { 
            this.verifierContract = await Verifier.new();
            this.solnSquareVerifierContract = await SolnSquareVerifier.new(this.verifierContract.address, 'Real Estate Title Token', 'RETT');
        });

        it('token is minted appropriately with 3**2=9 solution', async function () { 
            let mintResult = await this.solnSquareVerifierContract.mint.call(
                proof39['proof']['A'], proof39['proof']['A_p'],
                proof39['proof']['B'], proof39['proof']['B_p'],
                proof39['proof']['C'], proof39['proof']['C_p'],
                proof39['proof']['H'], proof39['proof']['K'], proof39['input']);
            assert.equal(true, mintResult, "not succesfully minted");
        });

        it('token is minted appropriately with 2**2=4 solution', async function () { 
            let mintResult2 = await this.solnSquareVerifierContract.mint.call(
                proof24['proof']['A'], proof24['proof']['A_p'],
                proof24['proof']['B'], proof24['proof']['B_p'],
                proof24['proof']['C'], proof24['proof']['C_p'],
                proof24['proof']['H'], proof24['proof']['K'], proof24['input']);
            assert.equal(true, mintResult2, "not succesfully minted");
        });

        it('solution is saved', async function () { 
            let mintResult3 = await this.solnSquareVerifierContract.mint(
                proof39['proof']['A'], proof39['proof']['A_p'],
                proof39['proof']['B'], proof39['proof']['B_p'],
                proof39['proof']['C'], proof39['proof']['C_p'],
                proof39['proof']['H'], proof39['proof']['K'], proof39['input']);
            assert.equal(mintResult3.logs[0]['event'], 'SolutionAdded', "solution was not recorded");
        });

        it('token cannot be minted twice with the same solution', async function () { 
            let accessDenied = false;
            try { 
                await this.solnSquareVerifierContract.mint(
                proof39['proof']['A'], proof39['proof']['A_p'],
                proof39['proof']['B'], proof39['proof']['B_p'],
                proof39['proof']['C'], proof39['proof']['C_p'],
                proof39['proof']['H'], proof39['proof']['K'], proof39['input']);
                }
            catch(e) { accessDenied = true; }
            assert.equal(accessDenied, true, "unique solution logic not working");
        });

        it('should have set name', async function () { 
            let name = await this.solnSquareVerifierContract.name.call();
            console.log(name);
            assert.equal(name, 'Real Estate Title Token', "returned name is wrong")
        })

        it('should have set symbol', async function () { 
            let symbol = await this.solnSquareVerifierContract.symbol.call();
            console.log(symbol);
            assert.equal(symbol, 'RETT', "returned symbol is wrong")
        })

    

    });

})

// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier




// it('solution is stored in contract', async function () { 
        //     let enc = web3.eth.abi.encodeParameters(proof39['proof']['A'], proof39['proof']['A_p'],
        //         proof39['proof']['B'], proof39['proof']['B_p'],
        //         proof39['proof']['C'], proof39['proof']['C_p'],
        //         proof39['proof']['H'], proof39['proof']['K'], proof39['input']);
        //     console.log(enc);
        //     console.log(enc.value);
        //     let solHash = web3.utils.soliditySha3(enc.value);
        //     let solution = await this.solnSquareVerifierContract.solutions.call(solHash);
        //     // let count = await this.solnSquareVerifierContract.counter.call();
        //     // assert.equal(count, 1, "counter increased")