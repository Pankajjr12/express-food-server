const Menu = require("../models/Menu");

const getAllMenuItems = async (req, res) => {
  try {
    const menus = await Menu.find({}).sort({ createdAt: -1 });
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// post menu item

const postMenuItem = async (req, res) => {
  const newItem = req.body;
  try {
    const result = await Menu.create(newItem);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete menu item

const deleteMenuItem = async (req, res) => {
  const menuId = req.params.id;
  try {
    const deletedItem = await Menu.findByIdAndDelete(menuId);

    if (!deletedItem) {
      return res.status(404).json({ message: "Menu Item not found" });
    }
    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// to get single menu item

const singleMenuItem = async (req, res) => {
  const menuId = req.params.id;
  try {
    const menu = await Menu.findById(menuId);
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update single item

const updateMenuItem = async (req, res) => {
  const menuId = req.params.id;
  const {
    name,
    recipe,
    image,
    category,
    price,
    backdropImages,
    description,
    likes,
    starRatings,
  } = req.body;
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      menuId,
      {
        name,
        recipe,
        image,
        category,
        price,
        backdropImages,
        description,
        likes,
        starRatings,
      },
      { new: true, runValidator: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likeMenuItem = async (req, res) => {
  const menuId = req.params.id;
  const userId = req.decoded.userId; // Assuming userId is present in the JWT payload
  try {
    // Check if the menu item exists
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu Item not found" });
    }

    // Check if the user already liked the menu item
    if (menu.likedByUsers.includes(userId)) {
      return res.status(400).json({ message: "User already liked this item" });
    }

    // Add user to likedByUsers array
    menu.likedByUsers.push(userId);

    // Remove user from dislikedByUsers array if they previously disliked the item
    const dislikedIndex = menu.dislikedByUsers.indexOf(userId);
    if (dislikedIndex !== -1) {
      menu.dislikedByUsers.splice(dislikedIndex, 1);
    }

    // Increment the like count
    menu.likes += 1;

    // Save the updated menu item
    await menu.save();

    res.status(200).json({ message: "Liked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const dislikeMenuItem = async (req, res) => {
  const menuId = req.params.id;
  const userId = req.decoded.userId; // Assuming userId is present in the JWT payload
  try {
    // Check if the menu item exists
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu Item not found" });
    }

    // Check if the user already disliked the menu item
    if (menu.dislikedByUsers.includes(userId)) {
      return res.status(400).json({ message: "User already disliked this item" });
    }

    // Add user to dislikedByUsers array
    menu.dislikedByUsers.push(userId);
    
    // Remove user from likedByUsers array if they previously liked the item
    const likedIndex = menu.likedByUsers.indexOf(userId);
    if (likedIndex !== -1) {
      menu.likedByUsers.splice(likedIndex, 1);
    }

    // Decrement the like count
    if (menu.likes > 0) {
      menu.likes -= 1;
    }

    // Save the updated menu item
    await menu.save();

    res.status(200).json({ message: "Disliked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Search menu items by name and category
const searchMenuItems = async (req, res) => {
  const { name, category, page } = req.query;
  const query = {};

  // Build the query object based on provided parameters
  if (name) {
    query.name = { $regex: name, $options: "i" }; // Case-insensitive search by name
  }
  if (category) {
    query.category = category; // Search by category
  }

  const perPage = 3; // Number of items per page
  const currentPage = parseInt(page) || 1; // Current page, default to 1 if not provided

  try {
    // Use the query object directly as a filter in the find method
    const totalItems = await Menu.countDocuments(query);
    const totalPages = Math.ceil(totalItems / perPage);

    const searchResults = await Menu.find(query)
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      results: searchResults,
      currentPage,
      totalPages,
      totalItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const testSearch = async (req, res) => {
//   try {
//     var search = "";
//     if (req.query.search) {
//       search = req.query.search;
//     }

//     var page = 1;
//     if (req.query.search) {
//       page = req.query.page;
//     }
//     const limit = 2;
//     const searchResults = await Menu.find({
//       $or: [
//         {
//           name: {
//             $regex: ".*" + search + ".*",
//             $options: "i",
//           },
//         },
//         {
//           category: {
//             $regex: ".*" + search + ".*",
//             $options: "i",
//           },
//         },
//       ],
//     }).limit(limit*1).skip((page-1)*limit).exec();
//     res.status(200).json(searchResults);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports = {
  getAllMenuItems,
  postMenuItem,
  deleteMenuItem,
  singleMenuItem,
  updateMenuItem,
  likeMenuItem,
  dislikeMenuItem,
  searchMenuItems,
  
};
