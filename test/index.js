/* global describe, it */

var normalize = require('../');
require('should');

describe('constructor', function () {
    it('should support custom string parsing', function () {
        normalize('jquery', {parseString: function (dep) {
            return { block: 'custom', elem: dep };
        }}).should.eql([{ block: 'custom', elem: 'jquery' }]);
    });

    it('should throw exception on empty object', function () {
        (function () {
            normalize({});
        }).should.throw();
    });

    it('should interpret undefined as empty array', function () {
        normalize(undefined).should.be.eql([]);
    });

    it("shouldn't create unnamed block", function () {
        (function() { normalize({ elems: ['elem'] }) }).should.throw();
    });

    it("shouldn't return empty elems", function () {
        normalize({ block: 'custom', elems: [''] }).should.eql([
            { block: 'custom' }
        ]);
    });

    it("shouldn't return empty mods", function () {
        normalize({ block: 'custom', mods: [''] }).should.eql([
            { block: 'custom' }
        ]);
    });

    it('should wrap objects into array', function () {
        var obj = {block: 'block'};
        normalize(obj).should.eql([obj]);
    });

    it('should throw when `elem` and `elems` defined', function () {
        (function() { normalize({ block: 'custom', elem: '', elems: [] }); }).should.throw();
    });

    it('should throw when `mod` and `mods` defined', function () {
        (function() { normalize({ modName: '', mods: [] }); }).should.throw();
    });

    it('should properly handle normal object', function () {
        var obj = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };
        normalize(obj).should.eql([obj]);
    });
});

describe('blocks', function () {

    it('should support string', function () {
        normalize('jquery').should.eql([{ block: 'jquery' }]);
    });

    it('should support object', function () {
        normalize({ block: 'jquery' }).should.eql([
            { block: 'jquery' }
        ]);
    });
});

describe('elems', function () {

    it('should create single element if `elem` passed', function () {
        normalize({ block: 'jquery', elem: 'placeholder' }).should.eql([
            { block: 'jquery', elem: 'placeholder' }
        ]);
    });

    it('should support arrays', function () {
        normalize({ block: 'table', elems: ['row', 'cell'] }).should.eql([
            { block: 'table' },
            { block: 'table', elem: 'row' },
            { block: 'table', elem: 'cell' }
        ]);
    });

    it('should pass context to result', function () {
        normalize({ block: 'b', elems: 'row' }).should.eql([
            { block: 'b' },
            { block: 'b', elem: 'row' }
        ]);
    });
});

describe('mods', function () {

    it('should create single element if `mod` passed', function () {
        normalize({ block: 'jquery', mod: 'placeholder' }).should.eql([
            { block: 'jquery', modName: 'placeholder' }
        ]);
    });

    it('should support objects', function () {
        normalize({ block: 'div', mods: { color: 'white', position: 'top' }}).should.eql([
            { block: 'div' },
            { block: 'div', modName: 'color', modVal: 'white' },
            { block: 'div', modName: 'position', modVal: 'top' }
        ]);
    });

    it('should pass context', function () {
        normalize({ block: 'b', elem: 'e', mods: { color: 'white' }}).should.eql([
            { block: 'b' },
            { block: 'b', elem: 'e', modName: 'color', modVal: 'white' }
        ]);
    });

    it('should not pass undefined props to result', function () {
        normalize({ block: 'bl', elem: 'e', mods: { color: undefined }})
            .should.eql([
                { block: 'bl' },
                { block: 'bl', elem: 'e', modName: 'color' }
            ]);
    });

    it('should support arrays as object values', function () {
        normalize({ block: 'div', mods: { color: 'white', position: ['top', 'bottom'] }}).should.eql([
            { block: 'div' },
            { block: 'div', modName: 'color', modVal: 'white' },
            { block: 'div', modName: 'position', modVal: 'top' },
            { block: 'div', modName: 'position', modVal: 'bottom' }
        ]);
    });

    it('should support array of strings as list of mods names', function () {
        normalize({ block: 'custom', mods: [ 'foo', 'bar' ] }).should.eql([
            { block: 'custom' },
            { block: 'custom', modName: 'foo' },
            { block: 'custom', modName: 'bar' }
        ]);
    });

    it('should support boolean values of mods', function() {
        normalize({ block: 'elem', mods: { focused: true }}).should.eql([
            { block: 'elem' },
            { block: 'elem', modName: 'focused', modVal: true }
        ]);
    });

    it('should support numeric values of mods', function() {
        normalize({ block: 'icon', mods: { facebook: 16 }}).should.eql([
            { block: 'icon' },
            { block: 'icon', modName: 'facebook', modVal: 16 }
        ]);
    });

    it('should support nested values of mods', function() {
        normalize({ block: 'icon', mods: [{ elem: 'confirm', mod: 'size', val: 16 }] }).should.eql([
            { block: 'icon' },
            { block: 'icon', elem: 'confirm', modName: 'size', modVal: 16 }
        ]);
    });
});
