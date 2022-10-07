import User from "../models/User";
import { Errors } from "../utils/errors";

let userController = {
  add: async (req, res) => {
    try {
      const { email } = req.body;

      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists)
        return res.status(400).json({ error: Errors.USER_ALREADY_EXISTS });

      const user = await User.create(req.body);

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: Errors.SERVER_ERROR });
    }
  },


  get: async (req, res) => {
    try {
      const users = await User.findAll();

      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: Errors.SERVER_ERROR });
    }
  },

  find: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user)
        return res.status(400).send({ error: Errors.NONEXISTENT_USER });

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: Errors.SERVER_ERROR });
    }
  },

  update: async (req, res) => {
    try {
      const { email, oldPassword } = req.body;

      const user = await User.findByPk(req.userId);

      if (email) {
        const userExists = await User.findOne({
          where: { email },
        });

        if (userExists)
          return res.status(400).json({ error: Errors.USER_ALREADY_EXISTS });
      }

      if (oldPassword && !(await user.checkPassword(oldPassword)))
        return res.status(401).json({ error: Errors.WRONG_PASSWORD });

      const newUser = await user.update(req.body);

      return res.status(200).json(newUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: Errors.SERVER_ERROR });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user)
        return res.status(400).send({ error: Errors.NONEXISTENT_USER });

      user.destroy();

      return res.status(200).json({ msg: "Deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: Errors.SERVER_ERROR });
    }
  },
};

export default userController;