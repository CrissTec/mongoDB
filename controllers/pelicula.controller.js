const Pelicula = require('../models/pelicula.model');



exports.create = function(req, res){
    let pelicula = new Pelicula({
        nombre: req.body.nombre,
        genero: req.body.genero,
        nombreDirector: req.body.nombreDirector,
        franquicia: req.body.franquicia,
        pais: req.body.pais,
        anno: req.body.anno,
        duracion: req.body.duracion,
        actores: req.body.actores,
        productora: req.body.productora
    });
    pelicula.save(function(err){
        if (err){
            res.send(err)
        }
        res.send('OK');
    })
};



exports.readAll = function(req, res){
    Pelicula.find(function (err, pelis){
        if (err){
            res.send(err)
        }
        res.send(pelis);
    });
};

exports.readById = function(req, res){
    Pelicula.findById(req.params.id, function(err, pelicula){
        if (err){
            res.send(err);
        }
        res.send(pelicula);
    });
};

exports.update = function(req, res){
    Pelicula.findByIdAndUpdate(req.params.id, {$set: req.body}, function(err, pelicula){
        if (err){
            res.send(err);
        }
        res.send("OK");
    });
}

exports.delete = function(req, res){
    Pelicula.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.send(err);
        }
        res.send("OK");
    });
}

exports.porTitulo = function(req, res){
    var query = {nombre: req.params.nombre}
    Pelicula.findOne(query, function(err, pelicula){
        if (err){
            res.send(err)
        }
        res.send(pelicula);
    });
}

exports.porFranquicia = function(req, res){
    var query = {franquicia: req.params.franquicia}
    Pelicula.find(query, function(err, peliculas){
        if (err){
            res.send(err)
        }
        res.send(peliculas);
    });
}

exports.porAnno = function(req, res){
    var query = {anno: {$gt: req.params.fechaInicial, $lt: req.params.fechaFinal}}
    Pelicula.find(query, function(err, peliculas){
        if (err){
            res.send(err)
        }
        res.send(peliculas);
    });
}

exports.porProductoraDatos = function(req, res){
    var query = {productora: req.params.productora}
    Pelicula.find(query, {nombre: 1, genero: 1, anno: 1}, function(err, peliculas){
        if (err){
            res.send(err)
        }
        res.send(peliculas)
    });
}

exports.porProductoraDuraciones = function(req, res){
    var aggregate = [{
        $group: 
            {
                _id: "$productora",
                duracionPromedio: { $avg: "$duracion"},
                duracionMaxima: {$max: "$duracion"},
                duracionMinima: {$min: "$duracion"},
            }}, 
        {$project:
            {
                _id: req.params.productora,
                value: {"cantidad": "$cantidad", "duracionPromedio": "$duracionPromedio","duracionMinima":"$duracionMinima", "duracionMaxima":"$duracionMaxima"}
            }

        },
    ];

    Pelicula.aggregate(aggregate, function(err, result){
        if (err){
            res.send(err)
        }
    });
    
}


