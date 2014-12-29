/* jshint -W024, expr:true */
/*jslint node: true */
/*global expect, fx, sinon*/
'use strict';
var selection = require('..').selection;
var _ = require('underscore');
var statutils = require('..').statutils;

describe('selection', function () {

  describe('spec', function () {
    it('should pass', function () {
      expect(selection.selectionNonAdaptive).to.not.be.undefined();
    });
    it('should pass', function () {
      expect(selection.selectionByJudge).to.not.be.undefined();
    });
    it('should have access to the fixtures', function () {
      expect(fx.decisions).to.not.be.undefined();
      expect(fx.judges).to.not.be.undefined();
      expect(fx.players).to.not.be.undefined();
      expect(fx.tasks).to.not.be.undefined();
    });
  });

  describe('selection algorithms', function () {
    it('should always choose the player with the fewest selections', function () {
      var pls = [];
      var mn = 100;
      for (var i = 0; i < 100; i++) {
        var selected = Math.floor(Math.random() * 100) + 1;
        mn = (selected < mn ? selected : mn);
        pls.push({
          selected: selected
        });
      }
      var pair = selection.selectionNonAdaptive(pls);
      expect(pair[0].selected).to.be.equal.to(mn);
    });
    it('should be an opponent not compared to yet if possible', function () {
      var pls = [];
      for (var i = 0; i < 100; i++) {
        pls.push({
          _id: i,
          selected: 0,
          opponents: [],
          trueScore: (Math.random() * 5) - 5,
          seTrueScore: 0.5
        });
      }
      var pair;
      for (var j = 0; j < 4950; j++) {
        pair = selection.selectionNonAdaptive(pls);
        for (i = 0; i < pls.length; i++) {
          if (pls[i]._id == pair[0]._id) {
            pls[i].selected++;
            pls[i].opponents.push(pair[1]._id);
          }
          if (pls[i]._id == pair[1]._id) {
            pls[i].selected++;
            pls[i].opponents.push(pair[0]._id);
          }
        }
      }
      for (i = 0; i < pls.length; i++) {
        expect(pls[i].selected).to.be.equal.to(99);
        expect(pls[i].opponents.length).to.be.equal.to(_.uniq(pls[i].opponents).length);
      }
      //Now go adaptive
      for (j = 0; j < 100; j++) {
        pair = selection.selectionNonAdaptive(pls);
        expect(Math.abs(pair[0].trueScore - pair[1].trueScore)).to.be.below(0.5);
        for (i = 0; i < pls.length; i++) {
          if (pls[i]._id == pair[0]._id) {
            pls[i].selected++;
            pls[i].opponents.push(pair[1]._id);
          }
          if (pls[i]._id == pair[1]._id) {
            pls[i].selected++;
            pls[i].opponents.push(pair[0]._id);
          }
        }
      }
    });
    it('for selection by judge, player should be the least judged by that judge.', function () {
      var pls = [];
      var judge = {
        _id: 'j1'
      };
      var ids = ['a', 'b', 'c', 'd'];
      for (var i = 0; i < ids.length; i++) {
        pls.push({
          _id: ids[i]
        });
      }
      var decisions = [];
      decisions.push({
        chosen: 'a',
        notChosen: 'b',
        judge: 'j2'
      });
      decisions.push({
        chosen: 'a',
        notChosen: 'd',
        judge: 'j2'
      });
      //Get all pairs
      var pair;
      var pairs = [];
      for (i = 0; i < 6; i++) {
        pair = selection.selectionByJudge(judge._id, pls, decisions);
        decisions.push({
          chosen: pair[0]._id,
          notChosen: pair[1]._id,
          judge: judge._id
        });
        pairs.push([pair[0]._id, pair[1]._id]);
      }
      //Check all pairs
      var combs = statutils.k_combinations(ids, 2);
      var diff = _.filter(combs, function (obj) {
        return !_.findWhere(pairs, obj) & !_.findWhere(pairs, [obj[1], obj[0]]);
      });
      expect(diff).eql([]);
      //All pairs exhausted
      pair = selection.selectionByJudge(judge._id, pls, decisions);
      expect(pair).to.have.length(2);
    });
  });
  describe('selectionAdaptive', function () {
    it('should always return player with fewest comparisons', function () {
      var pls = [];
      var mn = 100;
      for (var i = 0; i < 100; i++) {
        var selected = Math.floor(Math.random() * 100) + 1;
        mn = (selected < mn ? selected : mn);
        pls.push({
          selected: selected,
          trueScore: 0,
          comparisons: selected
        });
      }
      var pair = selection.selectionAdaptive(pls);
      expect(pair[0].selected).to.be.equal.to(mn);
    });
    it('with 0 judgements it should partner with next fewest judgements, not itself', function () {
      var pls = [];
      for (var i = 0; i < 2; i++) {
        pls.push({
          _id: i,
          selected: 0,
          comparisons: 0,
          trueScore: 0
        });
      }
      for (i = 0; i < 50; i++) {
        pls.push({
          _id: i,
          selected: 1,
          comparisons: 0,
          trueScore: 0
        });
      }
      for (i = 0; i < 100; i++) {
        var pair = selection.selectionAdaptive(pls);
        expect(pair[1]).not.equal(undefined);
        expect(pair[1].selected).to.equal(0);
      }
    });
    it('should work if there are no true scores', function () {
      var pls = [];
      for (var i = 0; i < 5; i++) {
        pls.push({
          _id: i,
          selected: i + 1,
          comparisons: i + 1
        });
      }
      var pair = selection.selectionAdaptive(pls);
      expect(pair[1].trueScore).to.equal(0);
    });
    it('should work if there is only one valid opponent', function () {
      var pls = [];
      for (var i = 0; i < 4; i++) {
        pls.push({
          _id: i,
          selected: i + 1,
          comparisons: i + 1,
          opponents: [0]
        });
      }
      pls.push({
        _id: 4,
        selected: 4,
        comparisons: 4
      });
      for (i = 0; i < 100; i++) {
        var pair = selection.selectionAdaptive(pls);
        expect(pair[1]._id).to.equal(4);
      }
    });
    it('should work if all opponents matched', function () {
      var pls = [];
      for (var i = 0; i < 5; i++) {
        pls.push({
          _id: i,
          selected: i + 1,
          comparisons: i + 1,
          opponents: [0]
        });
      }
      var pair = selection.selectionAdaptive(pls);
      expect(pair[1]._id).to.be.between(0, 5);
    });
    it('should return partner closer to ability more often than not', function () {
      var pls = [];
      var selected = [0, 0, 0, 0, 0];
      for (var i = 0; i < 5; i++) {
        pls.push({
          _id: i,
          selected: i + 1,
          comparisons: i + 1,
          trueScore: i
        });
      }
      for (i = 0; i < 100; i++) {
        var pair = selection.selectionAdaptive(pls);
        selected[pair[1].trueScore] ++;
      }
      //console.log('selected',selected);
      expect(selected[1] > selected[2]);
      expect(selected[2] > selected[3]);
      expect(selected[3] > selected[4]);
    });
  });
});