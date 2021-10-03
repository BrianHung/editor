"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableMap = exports.Rect = void 0;
let readFromCache, addToCache;
if (typeof WeakMap != "undefined") {
    let cache = new WeakMap;
    readFromCache = key => cache.get(key);
    addToCache = (key, value) => {
        cache.set(key, value);
        return value;
    };
}
else {
    let cache = [], cacheSize = 10, cachePos = 0;
    readFromCache = key => {
        for (let i = 0; i < cache.length; i += 2)
            if (cache[i] == key)
                return cache[i + 1];
    };
    addToCache = (key, value) => {
        if (cachePos == cacheSize)
            cachePos = 0;
        cache[cachePos++] = key;
        return cache[cachePos++] = value;
    };
}
class Rect {
    constructor(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
}
exports.Rect = Rect;
class TableMap {
    constructor(width, height, map, problems) {
        this.width = width;
        this.height = height;
        this.map = map;
        this.problems = problems;
    }
    findCell(pos) {
        for (let i = 0; i < this.map.length; i++) {
            let curPos = this.map[i];
            if (curPos != pos)
                continue;
            let left = i % this.width, top = (i / this.width) | 0;
            let right = left + 1, bottom = top + 1;
            for (let j = 1; right < this.width && this.map[i + j] == curPos; j++)
                right++;
            for (let j = 1; bottom < this.height && this.map[i + (this.width * j)] == curPos; j++)
                bottom++;
            return new Rect(left, top, right, bottom);
        }
        throw new RangeError("No cell with offset " + pos + " found");
    }
    colCount(pos) {
        for (let i = 0; i < this.map.length; i++)
            if (this.map[i] == pos)
                return i % this.width;
        throw new RangeError("No cell with offset " + pos + " found");
    }
    nextCell(pos, axis, dir) {
        let { left, right, top, bottom } = this.findCell(pos);
        if (axis == "horiz") {
            if (dir < 0 ? left == 0 : right == this.width)
                return null;
            return this.map[top * this.width + (dir < 0 ? left - 1 : right)];
        }
        else {
            if (dir < 0 ? top == 0 : bottom == this.height)
                return null;
            return this.map[left + this.width * (dir < 0 ? top - 1 : bottom)];
        }
    }
    rectBetween(a, b) {
        let { left: leftA, right: rightA, top: topA, bottom: bottomA } = this.findCell(a);
        let { left: leftB, right: rightB, top: topB, bottom: bottomB } = this.findCell(b);
        return new Rect(Math.min(leftA, leftB), Math.min(topA, topB), Math.max(rightA, rightB), Math.max(bottomA, bottomB));
    }
    cellsInRect(rect) {
        let result = [], seen = {};
        for (let row = rect.top; row < rect.bottom; row++) {
            for (let col = rect.left; col < rect.right; col++) {
                let index = row * this.width + col, pos = this.map[index];
                if (seen[pos])
                    continue;
                seen[pos] = true;
                if ((col != rect.left || !col || this.map[index - 1] != pos) &&
                    (row != rect.top || !row || this.map[index - this.width] != pos))
                    result.push(pos);
            }
        }
        return result;
    }
    positionAt(row, col, table) {
        for (let i = 0, rowStart = 0;; i++) {
            let rowEnd = rowStart + table.child(i).nodeSize;
            if (i == row) {
                let index = col + row * this.width, rowEndIndex = (row + 1) * this.width;
                while (index < rowEndIndex && this.map[index] < rowStart)
                    index++;
                return index == rowEndIndex ? rowEnd - 1 : this.map[index];
            }
            rowStart = rowEnd;
        }
    }
    static get(table) {
        return readFromCache(table) || addToCache(table, computeMap(table));
    }
}
exports.TableMap = TableMap;
function computeMap(table) {
    if (table.type.spec.tableRole != "table")
        throw new RangeError("Not a table node: " + table.type.name);
    let width = findWidth(table), height = table.childCount;
    let map = [], mapPos = 0, problems = null, colWidths = [];
    for (let i = 0, e = width * height; i < e; i++)
        map[i] = 0;
    for (let row = 0, pos = 0; row < height; row++) {
        let rowNode = table.child(row);
        pos++;
        for (let i = 0;; i++) {
            while (mapPos < map.length && map[mapPos] != 0)
                mapPos++;
            if (i == rowNode.childCount)
                break;
            let cellNode = rowNode.child(i), { colspan, rowspan, colwidth } = cellNode.attrs;
            for (let h = 0; h < rowspan; h++) {
                if (h + row >= height) {
                    (problems || (problems = [])).push({ type: "overlong_rowspan", pos, n: rowspan - h });
                    break;
                }
                let start = mapPos + (h * width);
                for (let w = 0; w < colspan; w++) {
                    if (map[start + w] == 0)
                        map[start + w] = pos;
                    else
                        (problems || (problems = [])).push({ type: "collision", row, pos, n: colspan - w });
                    let colW = colwidth && colwidth[w];
                    if (colW) {
                        let widthIndex = ((start + w) % width) * 2, prev = colWidths[widthIndex];
                        if (prev == null || (prev != colW && colWidths[widthIndex + 1] == 1)) {
                            colWidths[widthIndex] = colW;
                            colWidths[widthIndex + 1] = 1;
                        }
                        else if (prev == colW) {
                            colWidths[widthIndex + 1]++;
                        }
                    }
                }
            }
            mapPos += colspan;
            pos += cellNode.nodeSize;
        }
        let expectedPos = (row + 1) * width, missing = 0;
        while (mapPos < expectedPos)
            if (map[mapPos++] == 0)
                missing++;
        if (missing)
            (problems || (problems = [])).push({ type: "missing", row, n: missing });
        pos++;
    }
    let tableMap = new TableMap(width, height, map, problems), badWidths = false;
    for (let i = 0; !badWidths && i < colWidths.length; i += 2)
        if (colWidths[i] != null && colWidths[i + 1] < height)
            badWidths = true;
    if (badWidths)
        findBadColWidths(tableMap, colWidths, table);
    return tableMap;
}
function findWidth(table) {
    let width = -1, hasRowSpan = false;
    for (let row = 0; row < table.childCount; row++) {
        let rowNode = table.child(row), rowWidth = 0;
        if (hasRowSpan)
            for (let j = 0; j < row; j++) {
                let prevRow = table.child(j);
                for (let i = 0; i < prevRow.childCount; i++) {
                    let cell = prevRow.child(i);
                    if (j + cell.attrs.rowspan > row)
                        rowWidth += cell.attrs.colspan;
                }
            }
        for (let i = 0; i < rowNode.childCount; i++) {
            let cell = rowNode.child(i);
            rowWidth += cell.attrs.colspan;
            if (cell.attrs.rowspan > 1)
                hasRowSpan = true;
        }
        if (width == -1)
            width = rowWidth;
        else if (width != rowWidth)
            width = Math.max(width, rowWidth);
    }
    return width;
}
function findBadColWidths(map, colWidths, table) {
    if (!map.problems)
        map.problems = [];
    for (let i = 0, seen = {}; i < map.map.length; i++) {
        let pos = map.map[i];
        if (seen[pos])
            continue;
        seen[pos] = true;
        let node = table.nodeAt(pos), updated = null;
        for (let j = 0; j < node.attrs.colspan; j++) {
            let col = (i + j) % map.width, colWidth = colWidths[col * 2];
            if (colWidth != null && (!node.attrs.colwidth || node.attrs.colwidth[j] != colWidth))
                (updated || (updated = freshColWidth(node.attrs)))[j] = colWidth;
        }
        if (updated)
            map.problems.unshift({ type: "colwidth mismatch", pos, colwidth: updated });
    }
}
function freshColWidth(attrs) {
    if (attrs.colwidth)
        return attrs.colwidth.slice();
    let result = [];
    for (let i = 0; i < attrs.colspan; i++)
        result.push(0);
    return result;
}
