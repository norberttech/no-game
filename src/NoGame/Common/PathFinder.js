'use strict';

import Assert from 'assert-js';
import PF from 'pathfinding';
import Grid from './PathFinder/Grid';

export default class PathFinder
{
    constructor()
    {
        this._finder = new PF.AStarFinder({
            allowDiagonal: false
        });
    }

    /**
     * @param {int} fromX
     * @param {int} fromY
     * @param {int} toX
     * @param {int} toY
     * @param {Grid} grid
     *
     * @returns {Array}
     */
    findPath(fromX, fromY, toX, toY, grid)
    {
        Assert.integer(fromX);
        Assert.integer(fromY);
        Assert.integer(toX);
        Assert.integer(toY);
        Assert.instanceOf(grid, Grid);

        let pfGrid = new PF.Grid(grid.getSizeX(), grid.getSizeY());
        for (let position of grid.getTiles()) {
            pfGrid.setWalkableAt(position.x, position.y, position.walkable);
        }

        let path = this._finder.findPath(fromX, fromY, toX, toY, pfGrid);

        if (!path.length) {
            throw `Can't go from ${fromX}:${fromY} to ${toX}:${toY}.`;
        }

        return path.map((position) => {
            return {
                x: position[0],
                y: position[1]
            }
        });
    }
}