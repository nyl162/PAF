use paf;

CREATE TABLE paf.reply (
	respond_id int(12) AUTO_INCREMENT,
	Rname 	VARCHAR(24) NOT NULL,
    email	VARCHAR(48) NOT NULL,
    phone	VARCHAR(24) NOT NULL,
    attending ENUM("true", "false") NULL DEFAULT NULL,
    
    PRIMARY KEY (respond_id)
    
);