const Store = require("../model/Store");

const createStore = async (req, res) => {
    try {
        const { storeName, storeAddress } = req.body;
        if (!storeName || !storeAddress) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const existingStore = await Store.findOne({ where: { storeAddress } });
        if (existingStore) {
            return res.status(400).json({ error: "Store Address already exists." });
        }

        const newStore = await Store.create({
            storeName,
            storeAddress,
            storeStatus: "Active",
        });

        res.status(201).json({ newStore });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({ error: "Validation error: Please check the provided data." });
        }
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ error: "Store already exists." });
        }
        res.status(400).json({ error: `An error occurred: ${error.message}` });
    }
};
// Get all store
const getAllStores = async (req, res) => {
    try {
        const store = await Store.findAll();
        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a store by ID
const getStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Store.findByPk(id);

        if (store) {
            res.status(200).json(store);
        } else {
            res.status(404).json({ message: 'Store not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Store
const updateStore = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            storeName,
            storeAddress,
            storeStatus,
        } = req.body;

        const store = await Store.findByPk(id);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        await store.update({
            storeName,
            storeAddress,
            storeStatus,
        });

        res.status(200).json(store);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a Store
const deleteStore = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Store.findByPk(id);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }
        await store.destroy();
        res.status(200).json({ message: "Store deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    createStore,
    getAllStores,
    getStoreById,
    updateStore,
    deleteStore,
};
