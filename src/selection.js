// Chris's selection method
selectionNonAdaptive = function(players){
    //Find the player with the fewest decisions
    //Sort players in ascending order
    var players = _.sortBy(players, function(num){return num.selected;});
    //reverse so players are now in descending order
    players.reverse();
    var player = players.pop();
    //First decision? Choose the player with the next fewest decisions
    if (!player.hasOwnProperty('opponents')){
	var opponent = players.pop();
	//console.log('No previous opponents, taking opponent with fewest decisions',opponent);
    } else {
	//Find if there are any players he hasn't been compared to
	var rest = _.difference(_.map(players,function(num){return num._id}), player.opponents);               
	//console.log("not yet been compared to",rest);
	//If there are more than one, choose one with fewest comparisons (array is still sorted in decision order)
	if(rest.length > 0){
	    oppId = rest.pop();
	    var opponent = _.find(players, function(num){return num._id == oppId;});
	    //console.log(opponent);
	} else {
	    //All matches have been made
	    //console.log("all pairs done");
	    //All matches have been made at least once
	    //Turn on adaptive?
	    //console.log("turning on adaptive");
	    //Get everyone who is not himself within standard error
	    var gt = player.trueScore - player.seTrueScore;
	    var lt = player.trueScore + player.seTrueScore;
	    var adaptive = _.filter(players, function(num){return num.trueScore > gt && num.trueScore < lt});
	    //Inside adaptive choose pair with fewest decisions
	    if (adaptive.length > 0) {
		//If there are opponents close to true score, choose one with fewest decisions
		//console.log('At least one possible adaptive opponent', adaptive);
		var opponent = adaptive.pop();
	    } else {
		//If there are no opponents close to true score, choose one with fewest decisions
		//Might be better to choose opponent least compared to
		//console.log('All pairs done, choosing opponent with fewest decisions');
		var opponent = players.pop();
	    }
	}
    }
    // Update Judges Collection with current pair information
    return [player,opponent];
}
