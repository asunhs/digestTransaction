var _ = require('underscore');

function summarize(transactions) {
    return _.chain(transactions).reduce(function (box, item) {
        box[item.from] = (box[item.from] || 0) - item.amount;
        box[item.to] = (box[item.to] || 0) + item.amount;
        return box;
    }, {}).value();
}

function digest(source) {

    // 나중에 sort 는 때도 됨
    var members = _.keys(source),
        combination = function (k, lhs, rhs) {
            /* k is number
             * lhs, rhs is array
             */

            var self = lhs;

            if (k <= 0) {
                // stop conditions
                return rhs.reduce(function (sum, key) {
                    return sum + source[key];
                }, 0) == 0 ? [rhs] : [];
            }

            return _.flatten(lhs.map(function (set) {
                return combination(k-1, self = _.difference(self, set), _.union(rhs, set));
            }), true);
        },
        pascal = function (members) {
            var index,
                result = [];

            for (index = members.length - 1; index >= 2 ; index -= 1) {
                result.push(combination(index, members, []));
            }

            return _.flatten(result, true);
        },
        memos = [],
        traversal = function (initSet) {
            // for memorized
            var memorized = _.find(memos, function (memo) {
                return _.isEqual(memo.set, initSet);
            });

            // check memorize condition
            if (!!memorized) {
                return memorized.group;
            }

            var sets = pascal(initSet),
                group;

            if (_.isEmpty(sets)) {
                // stop condition
                return {
                    point : 1,
                    set : [initSet]
                };
            }

            group = sets.reduce(function (max, set) {

                var s = traversal(set),
                    d = traversal(_.difference(initSet, set)),
                    p = {
                        point : s.point + d.point,
                        set : _.union(s.set, d.set)
                    };

                // 가장 많이 쪼개지는 경우를 선정
                return _.max([max, p], function (item) {
                    return item.point;
                });

            }, { point : 0 });

            memos.push({
                group : group,
                set : initSet
            });

            return group;
        };

    return traversal(members).set.map(function (set) {
        return set.map(function (member) {
            return { member : member, amount : source[member] };
        });
    });
}

// TODO uint 으로 분리하기
function match(set) {
    var methods = [],
        play = function (positives, negatives) {
            if (!positives.length || !negatives.length) {
                return;
            }

            var positive = positives[0],
                negative = negatives[0],
                matchResult = positive.amount + negative.amount;

            if (matchResult > 0) {
                methods.push({
                    from : negative.member,
                    to : positive.member,
                    amount : 0 - negative.amount
                });
                positive.amount = matchResult;
                play(positives, _.rest(negatives));
            } else {
                methods.push({
                    from : negative.member,
                    to : positive.member,
                    amount : positive.amount
                });
                negative.amount = matchResult;
                play(_.rest(positives), negatives);
            }
        },
        groups = _.partition(set, function isPositive(member) {
            return member.amount > 0;
        });

    // 0 : positive, 1 : negative
    play(groups[0], groups[1]);

    return methods;
}


function matchAll(sets) {
    return _.flatten(sets.map(match), true);
}


module.exports = {
    summarize : summarize,
    digest : digest,
    match : match,
    matchAll : matchAll,
    getMethods : function (source) {
        return matchAll(digest(source));
    }
}