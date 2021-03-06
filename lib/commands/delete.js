"use strict";

module.exports = function(connection, parsed, data, callback) {

    if (!parsed.attributes ||
        parsed.attributes.length !== 1 ||
        !parsed.attributes[0] ||
        ["STRING", "LITERAL", "ATOM"].indexOf(parsed.attributes[0].type) < 0
    ) {

        connection.send({
            tag: parsed.tag,
            command: "BAD",
            attributes: [{
                type: "TEXT",
                value: "DELETE expects mailbox name"
            }]
        }, "INVALID COMMAND", parsed, data);
        return callback();
    }

    if (["Authenticated", "Selected"].indexOf(connection.state) < 0) {
        connection.send({
            tag: parsed.tag,
            command: "BAD",
            attributes: [{
                type: "TEXT",
                value: "Log in first"
            }]
        }, "DELETE FAILED", parsed, data);
        return callback();
    }

    var path = parsed.attributes[0].value;

		connection.delMailbox(path,function (err,data) {
			if (err) {
        connection.send({
            tag: parsed.tag,
            command: "NO",
            attributes: [{
                type: "TEXT",
                value: err
            }]
        }, "DELETE FAILED", parsed, data);
			} else {
		    connection.send({
		        tag: parsed.tag,
		        command: "OK",
		        attributes: [{
		            type: "TEXT",
		            value: "DELETE completed"
		        }]
		    }, "DELETE", parsed, data);
			}
	    return callback();
		});
};