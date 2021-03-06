# 2.7.0

* Fix edge case error when you have a single node with no parents and no children and and drop the node in the same place [#510](https://github.com/angular-ui-tree/angular-ui-tree/pull/510)
* Fix error in the `apply` function [#512](https://github.com/angular-ui-tree/angular-ui-tree/pull/512)
* Fix calculation of the placeholder width [#526](https://github.com/angular-ui-tree/angular-ui-tree/pull/526) [#470](https://github.com/angular-ui-tree/angular-ui-tree/pull/470)

# 2.6.0

* Use `data-nodrag` instead of `nodrag` attribute in the examples, as `$uiTreeHelper` service looks for the first one [#468](https://github.com/angular-ui-tree/angular-ui-tree/pull/468)
* Drag-dropping a node in the same position and container no longer removes and re-adds it to its parent node array [#485](https://github.com/angular-ui-tree/angular-ui-tree/pull/485)
* `bower.json` should reference only one copy of `angular-ui-tree.js` in main [#488](https://github.com/angular-ui-tree/angular-ui-tree/pull/488)

# 2.5.0

* Prevents child node scope with no children to be counted in depth [#388](https://github.com/angular-ui-tree/angular-ui-tree/pull/388)
* Fix callback errors when we have intermediate isolated scopes [#423](https://github.com/angular-ui-tree/angular-ui-tree/pull/423)
* Rename API attribute for toggling the empty placeholder [#450](https://github.com/angular-ui-tree/angular-ui-tree/pull/450)

# 2.4.0

* Added JSCS validation task [#441](https://github.com/angular-ui-tree/angular-ui-tree/pull/441)
* Bugfix `data-drag-delay` to actually delay `dragStart` [#444](https://github.com/angular-ui-tree/angular-ui-tree/pull/444)

# 2.3.0

* Add `data-clone-enabled` option + fix `data-drop-enabled` option ([#411](https://github.com/angular-ui-tree/angular-ui-tree/pull/411))
* Replaced Grunt with Gulp for the build process ([#435](https://github.com/angular-ui-tree/angular-ui-tree/pull/435))
* Fixed memory leak [#421](https://github.com/angular-ui-tree/angular-ui-tree/pull/421)

# 2.2.0

* release has been [reverted](https://github.com/angular-ui-tree/angular-ui-tree/commit/800dd0a43ce105d6301cd42038c1a28dbe3cd21e) to v2.1.5

# 2.1.5 (2014-07-31)

* latest release without CHANGELOG
