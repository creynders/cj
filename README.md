cj
==

Comparative Judgement Algorithms

Component Dependencies
----------------------
* Underscorejs.org

### Selection Methods ###
* selectionNonAdaptive = function(players)
Chris's selection algorithm

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


