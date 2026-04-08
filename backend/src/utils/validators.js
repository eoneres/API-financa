const { body, param, query, validationResult } = require('express-validator');
const { VALID_TRANSACTION_TYPES, VALID_CATEGORIES } = require('./constants');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        error: 'Erro de validação',
        details: errors.array().map(err => ({
            field: err.param,
            message: err.msg,
            value: err.value
        }))
    });
};

const authValidations = {
    register: [
        body('email')
            .isEmail()
            .withMessage('Email inválido')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Senha deve ter no mínimo 6 caracteres'),
        body('name')
            .optional()
            .isString()
            .withMessage('Nome deve ser texto'),
        validate
    ],

    login: [
        body('email')
            .isEmail()
            .withMessage('Email inválido')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Senha é obrigatória'),
        validate
    ]
};

const transactionValidations = {
    create: [
        body('description')
            .notEmpty()
            .withMessage('Descrição é obrigatória')
            .isString()
            .withMessage('Descrição deve ser texto'),
        body('amount')
            .isFloat({ min: 0.01 })
            .withMessage('Valor deve ser maior que 0'),
        body('type')
            .isIn(VALID_TRANSACTION_TYPES)
            .withMessage('Tipo deve ser INCOME ou EXPENSE'),
        body('category')
            .isIn(VALID_CATEGORIES)
            .withMessage('Categoria inválida'),
        body('date')
            .optional()
            .isISO8601()
            .withMessage('Data inválida'),
        validate
    ],

    update: [
        param('id')
            .isString()
            .withMessage('ID inválido'),
        body('description')
            .optional()
            .isString()
            .withMessage('Descrição deve ser texto'),
        body('amount')
            .optional()
            .isFloat({ min: 0.01 })
            .withMessage('Valor deve ser maior que 0'),
        body('type')
            .optional()
            .isIn(VALID_TRANSACTION_TYPES)
            .withMessage('Tipo deve ser INCOME ou EXPENSE'),
        body('category')
            .optional()
            .isIn(VALID_CATEGORIES)
            .withMessage('Categoria inválida'),
        body('date')
            .optional()
            .isISO8601()
            .withMessage('Data inválida'),
        validate
    ],

    idParam: [
        param('id')
            .isString()
            .withMessage('ID inválido'),
        validate
    ]
};

const reportValidations = {
    period: [
        query('startDate')
            .optional()
            .isISO8601()
            .withMessage('Data inicial inválida'),
        query('endDate')
            .optional()
            .isISO8601()
            .withMessage('Data final inválida'),
        validate
    ]
};

module.exports = {
    authValidations,
    transactionValidations,
    reportValidations,
    validate
};