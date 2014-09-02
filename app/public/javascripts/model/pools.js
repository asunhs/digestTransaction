(function () {
    'use strict';
    
    var pool = {};
    
    function setPool(item) {
        if (!item._id) {
            throw new Error('need [_id] field')
        }
        
        pool[item._id] = pool[item._id] || item;
        
        return _.extend(pool[item._id], item);
    }
    
    function getPool(id) {
        return pool[id];
    }
    
    angular.module('DutchPayApp').value('Pool', {
        get : getPool,
        set : setPool
    });
    
    
    
    
    var temporary = {},
        uuid = function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        };;
    
    function setTemporary(item) {
        
        item.temporary = item.temporary || uuid();
        
        temporary[item.temporary] = temporary[item.temporary] || item;
        
        return _.extend(temporary[item.temporary], item);
    }
    
    function getTemporary(key) {
        return temporary[key];
    }
    
    function popTemporary(key) {
        var temp = temporary[key];
        delete temp.temporary;
        delete temporary[key];
        
        return temp;
    }
    
    angular.module('DutchPayApp').value('Temporary', {
        get : getTemporary,
        set : setTemporary,
        pop : popTemporary
    });
    
}());