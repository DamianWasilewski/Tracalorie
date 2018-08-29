// Storage Controller
const StorageCtrl = (function() {
  // Public methods
  return {
    storeItem: function(item) {
      let items;
      // Check if any items in local storage
      if(localStorage.getItem('items') === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        // Push new item
        items.push(item);
        // Reset local storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    }
  }
})(); 

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItem: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = null;
      // Loop through items
      data.items.forEach(function(item) {
        if(item.id === id) {
          found = item;
        } 
      });
      return found;
    },
    updateItem: function(name, calories) {
      // Calories to number
      calories = parseInt(calories);
      
      let found = null;

      data.items.forEach(function(item) {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      // Get ids
      const ids = data.items.map(function(item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;

      data.items.forEach(function(item) {
        total += item.calories;
      });
      // Set total calories in data structure
      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function(){
      return data;
    }
  }
})();
// UI Controller
const UiCtrl = (function() {
  const UiSelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }
  
  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
           <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>`;
      });

      // Insert list items

      document.querySelector(UiSelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UiSelectors.itemNameInput).value,
        calories: document.querySelector(UiSelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item) {
      // Show the list
      document.querySelector(UiSelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
       <i class="edit-item fa fa-pencil"></i>
      </a>`;
      // Insert item
      document.querySelector(UiSelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UiSelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function(listItem) {
        const itemId = listItem.getAttribute('id');

        if(itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
           <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function(id){
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    clearInput: function() {
      document.querySelector(UiSelectors.itemNameInput).value = '';
      document.querySelector(UiSelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UiSelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UiSelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UiCtrl.showEditState();
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UiSelectors.listItems);
      // Turn Node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function(item) {
        item.remove();
      });
    },
    hideList: function() {
      document.querySelector(UiSelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UiSelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      UiCtrl.clearInput();
      document.querySelector(UiSelectors.updateBtn).style.display = 'none';
      document.querySelector(UiSelectors.deleteBtn).style.display = 'none';
      document.querySelector(UiSelectors.backBtn).style.display = 'none';
      document.querySelector(UiSelectors.addBtn).style.display = 'inline';
    },
    showEditState: function() {
      document.querySelector(UiSelectors.updateBtn).style.display = 'inline';
      document.querySelector(UiSelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UiSelectors.backBtn).style.display = 'inline';
      document.querySelector(UiSelectors.addBtn).style.display = 'none';
    },
    getSelectors: function() {
      return UiSelectors;
    }
  }
})();
// App Controller
const App = (function(ItemCtrl, StorageCtrl, UiCtrl) {
  const loadEventListeners = function() {
    const UiSelectors = UiCtrl.getSelectors();

    document.querySelector(UiSelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable sumbit on "enter"
    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    //Edit icon click event
    document.querySelector(UiSelectors.itemList).addEventListener('click', itemEditClick);
    // Update item event
    document.querySelector(UiSelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    // Delte item event
    document.querySelector(UiSelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    // Back button event
    document.querySelector(UiSelectors.backBtn).addEventListener('click', UiCtrl.clearEditState);
    // Clear all event
    document.querySelector(UiSelectors.clearBtn).addEventListener('click', clearAllItemsClick);

  }

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get from input from UI Controller
    const input = UiCtrl.getItemInput();

    // Check for name and calorie input
    if(input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add to UI list
      UiCtrl.addListItem(newItem);
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UiCtrl.showTotalCalories(totalCalories);
      // Store in local storage
      StorageCtrl.storeItem(newItem);
      // Clear input fields
      UiCtrl.clearInput();
    }
    
    e.preventDefault();
  }
  // Update item submit
  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')) {
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;

      const listIdArray = listId.split('-');
      // Get the actual id
      const id = parseInt(listIdArray[1]);
      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      // Add item to form
      UiCtrl.addItemToForm();
    }

    e.preventDefault();
  }

  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UiCtrl.getItemInput();
    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);         // Update UI
    UiCtrl.updateListItem(updatedItem);

    const totalCalories = ItemCtrl.getTotalCalories();
    UiCtrl.showTotalCalories(totalCalories);

    UiCtrl.clearEditState();

    e.preventDefault();
  }

  const itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();
    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);
    // Delete from UI
    UiCtrl.deleteListItem(currentItem.id);

    const totalCalories = ItemCtrl.getTotalCalories();
    UiCtrl.showTotalCalories(totalCalories);

    UiCtrl.clearEditState();

    e.preventDefault();
  }

  const clearAllItemsClick = function() {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    const totalCalories = ItemCtrl.getTotalCalories();
    UiCtrl.showTotalCalories(totalCalories);
    // Remove from UI
    UiCtrl.removeItems();

    // Hide UL
    UiCtrl.hideList();

  }

  return {
    init: function() {
      // Clear edit state
      UiCtrl.clearEditState();
      // Fetch items from data structure
      const items = ItemCtrl.getItem();

      // Check if any items
      if(items.length === 0) {
        UiCtrl.hideList();
      } else {
        // Populate list with items
      UiCtrl.populateItemList(items);
      }

      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UiCtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, StorageCtrl, UiCtrl);

App.init();