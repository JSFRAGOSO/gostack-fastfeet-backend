import * as Yup from 'yup';

export default async (req, res, next) => {
    const schema = Yup.object().shape({
        name: Yup.string().required(),
        street: Yup.string().required(),
        number: Yup.number().required(),
        state: Yup.string().required(),
        city: Yup.string().required(),
        zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
        return res.status(400).json({ error: 'Invalid Request' });

    return next();
};
