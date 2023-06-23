
exports.clear_cookies = (req, res) => {
    return res.status(401).cookie("token", "NULL").cookie("session", "NULL").cookie("name", "NULL").redirect("/login")
}

exports.clear_cookies_inservererr = (req, res) => {
    return res.status(401).cookie("token", "NULL").cookie("session", "NULL").cookie("name", "NULL").redirect("/login")
}

exports.login_inservererr = (req, res) => {
    return res.status(500).cookie('token', "NULL").cookie("session", "NULL").cookie('name', 'NULL').send({ "status": "error", "message": "Erreur : une erreur est survenue lors de la connexion" });
}

exports.invalid_session = (req, res) => {
    return res.status(400).cookie('token', "NULL").cookie('name', 'NULL').cookie('name', 'NULL').send({ "status": "error", "message": "Erreur : session invalide" });
}

exports.incorrect_password = (req, res) => {
    return res.status(400).send({ "status": "error", "message": "Mot de passe incorrect" });
}

exports.incorrect_email = (req, res) => {
    return res.status(400).send({ "status": "error", "message": "l'utilisateur n'existe pas" });
}

exports.logout_success = (req, res) => {
    return res.status(200).cookie('token', "NULL").cookie("session", "NULL").cookie('name', 'NULL').redirect('/');
}

exports.logout_error_occured = (req, res) => {
    return res.status(500).cookie('token', "NULL").cookie("session", "NULL").cookie('name', 'NULL').redirect('/');
}

exports.register_inservererr = (req, res) => {
    return res.status(500).cookie('token', "NULL").cookie("session", "NULL").cookie('name', 'NULL').send({ "status": "error", "message": "Erreur : une erreur est survenue lors de l'enregistrement merci de réesayer plus tard" });
}

exports.missing_infos = (req, res) => {
    return res.status(400).send({ "status": "error", "message": "Informations manquantes" });
}

exports.email_already_exist = (req, res) => {
    return res.status(400).send({ "status": "error", "message": "L'adresse mail est déjà utilisé pour un autre compte" });
}

exports.error_while_leaving_room = (req, res) => {
    return res.status(500).send({ "status": "internerror", "message": "une erreur est survenue lors de la sortie de la salle"});
}

exports.error_while_deleting_room = (req, res) => {
    return res.status(500).send({ "status": "internerror", "message": "une erreur est survenue lors de la suppression de la salle"});
}

exports.not_your_room = (req, res) => {
    return res.status(400).send({ "status": "error", "message": "Cette salle n'est pas la votre, redirection..."});
}

exports.room_not_found = (req, res) => {
    return res.status(400).send({ "status": "error", "message": "La salle que vous essayez de supprimer n'existe pas, redirection..."});
}

exports.error_while_listing_rooms = (req, res) => {
    return res.status(500).send({ "status": "internerror", "message": "une erreur est survenue lors de la récupération des salles"});
}
