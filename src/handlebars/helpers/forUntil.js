/**
 * Given an integer, iterate and provide the index for it
 * For Examples:
 * 
 * input.json
 * ```
 * {
 * 	"count": 2
 * }
 * ```
 * 
 * template.yaml
 * ```
 * hello:
 *   {{#forUntil "count"}}
 *   - @index
 *   {{/forUntil}}
 * ```
 * 
 * output.yaml
 * ```
 * hello:
 *   - 1
 *   - 2
 * ```
 */

// For until helper
module.exports = function(total, options) {
    let buffer = '';
    let i = -1;
    // Iterate the total
    while (++i < total) {
        let privateVar = {
            index: i,
            count: (i+1),
            total: total,
            length: total,
            isFirst: (i === 0),
            isLast: (i === (total - 1))
        };
        // Compute each iteration
        buffer += options.fn(this, {data: privateVar});
    }
    // Output it
    return buffer;
};
