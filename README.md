cj
==

Comparative Judgement Algorithms

If you would like to learn more about Comparative Judgement, or to see how it works in action, please visit:
http://www.nomoremarking.com

Component Dependencies
----------------------
* Underscorejs.org

### Simulations ###

    //Simulate a set of comparative judgement results
    //Saved to the file out.csv
    node index.js -i iterations -p players -j judgements -s selection-method -t thru -a AP -sd seed
    // Run 10 simulations of 20 candidates receiving 190 judgements using the adaptive method
    // With an expect number of 19 judgements per candidate
    // With an acceleration parameter of 2
    // And a seed for the simulation of 1234
    node index.js -s -i 10 -p 20 -j 190 -s 'adaptive' -t 19 -a 2 -sd 1234
    // Run 10 simulations of 20 candidates receiving 190 judgements using the distributed method
    // And a seed for the simulation of 1234
    node index.js -s -i 10 -p 20 -j 120 'distributed' -sd 1234

### Pair Selection Methods ###

#####  function selectionNonAdaptive (players) #####

1. Shuffles the items, then selects the item with fewest judgements
2. Pairs the item with any item not yet paired with
3. If all pairs exhausted, returns the item with the next fewest judgements

##### function selectionAdaptive( players, thr, AP ) #####

Uses the progressive method (Barrada, Olea, Ponsoda, and Abad, 2008, 2010; Revuelta and Ponsoda, 1998)

    thr - the number of comparisons expected for a item (analagous to test length)
    AP - the acceleration parameter

With the progressive method the item selected is the one that maximizes the sum of two elements,a random part and a part determined by the Fisher information.  At the beginning of the test, the importance of the random element is maximum; as the test advances, the information increases its relevance in the item selection. The speed for the transition from purely random selection to purely information based selection is determined by the acceleration parameter, set by the argument AP, where higher values imply a greater importance of the random element during the test.

##### function selectionByJudge(idJudge, players, decisions)

Ensures every judge sees every pair. Useful if you want to construct a reliable scale for every judge.

### Utility Functions ###

##### Return a scale for every judge from a csv download of decisions from nomoremarking.com #####

node index.js -b -d ~/Downloads/image-study-beauty.csv -e 'image_b_1@gmx.net','image_b_2@gmx.net'

### Functions ###
* rasch = function(ability, difficulty)
* estimateJudges = function(players, decisions, judges, callback)
* average = function(a)
* estimateReliability = function(players)
* markerInfit = function(players, decisions, judges, updateHolder, callback)
* resInfo = function(p)
* estimateCJ = function(task, decisions, players, controller)
* cjEstimation = function(task, playerids, players , decisions, updateHolder, callback, iters, controller)

### JSON Objects ###
##### Players #####
```
{
        "_id" : "22QCYH8oJYsoHYz69",
        "comparisons" : 0,
        "createdAt" : "2014-05-06 08:59:28",
        "decisions" : [  "tgHjzRze7jdTqbyYA" ],
        "observedScore" : 0,
        "owner" : "xDMzcHpZDhKXJ7wzk",
        "selected" : 0,
        "task" : "YCpw984EfTJmeTJeR",
        "timeTaken" : 0,
        "trueScore" : 0
}  
```
##### Judges #####
```
{
        "_id" : "23aa6mFLA5MaWBXPZ",
        "comparisons" : 20,
        "createdAt" : "2014-05-078 15:29:28",
        "email" : "a@b.c",  
        "frm_welcome_email_sent" : 0,
        "owner" : "avbgKt4ygLfyoWQGw",
        "quota" : 20,
        "task" : "6ZEKR54w45a5hn8gk",
        "timeTaken" : 11443.797999999999,
        "trueScore" : 0.8063503582501295  
}
```
##### Decisions #####
```
{
        "task" : "8M5b8yxRatHicgaqu",
        "chosen" : "hpGN6h4TJJrurRBrZ",
        "notChosen" : "zA3ZRBJnTHSrytaxo",
        "timeTaken" : 10.207,
        "judge" : "ZyNFixaAqxTADWmZw",
        "createdAt" : "2014-05-07 14:23:34",
        "_id" : "235x5zwkfm32DvpCZ"
}  
```

## Contributing

The Grunt CLI needs to be installed (globally):

```shell
npm install -g grunt-cli
```

(Could be you need to do it as `sudo`.)
Next `cd` to the project directory and:

```shell
npm install
```

This will install all necessary dependencies.

### Building

Some parts of this project are client-side compatible. To build the distribution files:

```shell
grunt build
```

This will generate the distributable and minified files into the `dist` directory.

### Testing

The tests use Mocha as the testing framework, must.js as an assertion library and sinon.js for mocking and spying.

To run all the tests:

```shell
npm test
# or
grunt test
```

### Benchmarking

Run all benchmarks:

```shell
grunt benchmark
```

Results are written to  `benchmarks/results.csv`.
