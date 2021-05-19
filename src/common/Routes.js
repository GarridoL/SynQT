import config from 'src/config';
const url = config.IS_DEV;
let apiUrl = url + '/';
export default {
  auth: apiUrl + 'authenticate',
  authUser: apiUrl + 'authenticate/user',
  authRefresh: apiUrl + 'authenticate/refresh',
  authInvalidate: apiUrl + 'authenticate/invalidate',
  accountRetrieve: apiUrl + 'accounts/retrieve',
  accountUpdate: apiUrl + 'accounts/update',
  accountCreate: apiUrl + 'accounts/create',
  notificationsRetrieve: apiUrl + 'notifications/retrieve_synqt_notifications',
  notificationUpdate: apiUrl + 'notifications/update',
  notificationCreate: apiUrl + 'notifications/create',
  notificationDelete: apiUrl + 'notifications/delete',
  accountProfileCreate: apiUrl + 'account_profiles/create',
  accountProfileUpdate: apiUrl + 'account_profiles/update',
  accountInformationRetrieve: apiUrl + 'account_informations/retrieve',
  accountInformationUpdate: apiUrl + 'account_informations/update',
  emailAlert: apiUrl + 'emails/alert',
  locationCreate: apiUrl + 'locations/create',
  locationRetrieve: apiUrl + 'locations/retrieve',
  locationDelete: apiUrl + 'locations/delete',
  addAddress: apiUrl + 'locations/create',
  retrieveSavedAddresses: apiUrl + 'locations/retrieve',
  // messenger
  customMessengerGroupCreate: apiUrl + 'custom_messenger_groups/create',
  messengerGroupUpdate: apiUrl + 'messenger_groups/update',
  messengerGroupUpdateTitle: apiUrl + 'messenger_groups/update_title',
  messengerGroupRetrieve: apiUrl + 'messenger_groups/retrieve_by_member',
  messengerGroupCreate: apiUrl + 'messenger_groups/create_group_with_members',
  messengerGroupRetrieveByParams:
    apiUrl + 'messenger_groups/retrieve_by_params',
  messengerMessagesCreate: apiUrl + 'messenger_messages/create',
  messengerMessagesRetrieve: apiUrl + 'messenger_messages/retrieve',
  messengerMessagesUpdate: apiUrl + 'messenger_messages/update_by_status',
  messengerMembersRetrieve: apiUrl + 'messenger_members/retrieve_members',
  messengerMembersCreate: apiUrl + 'messenger_members/create',
  mmCreateWithImageWithoutPayload: apiUrl + 'messenger_messages/create_with_image_without_payload',
  imageUploadUnLink: apiUrl + 'images/upload_un_link',
  // referral
  invitationCreate: apiUrl + 'invitations/create',
  invitationRetrieve: apiUrl + 'invitations/retrieve',
  // images
  imageUpload: apiUrl + 'images/upload',
  imageRetrieve: apiUrl + 'images/retrieve',

  // dashboard result
  dashboardRetrieve: apiUrl + 'paddocks/dashboard_batches',
  // carts
  // cartsCreate: apiUrl + 'carts/create',
  // cartsRetrieve: apiUrl + 'carts/retrieve',
  // cartsDelete: apiUrl + 'carts/delete',
  // cartsUpdate: apiUrl + 'carts/update',
  // coupons
  // couponsRetrieve: apiUrl + 'coupons/retrieve',
  // products
  productsRetrieve: apiUrl + 'products/retrieve_basic',
  productsRetrieveWithOrderId: apiUrl + 'products/retrieve_with_order_number',
  // dashboard
  // dashboardRetrieveCategoryList: apiUrl + 'dashboard/categories',
  // dashboardRetrieveFeaturedProducts: apiUrl + 'dashboard/featured',
  // dashboardRetrieveCategoryProducts: apiUrl + 'dashboard/category',
  // dashboardRetrieveShops: apiUrl + 'dashboard/shops_in_array',
  // merchantRetrieve: apiUrl + 'merchants/retrieve',
  // checkout || orders
  // checkoutCreate: apiUrl + 'checkouts/create',
  // ordersRetrieve: apiUrl + 'checkouts/retrieve_orders',
  // orderItemsRetrieve: apiUrl + 'checkout_items/retrieve_on_orders',
  // shippingFee: apiUrl + 'checkouts/get_shipping_fee',
  // notification settings
  notificationSettingsRetrieve: apiUrl + 'notification_settings/retrieve',
  filters: apiUrl + 'dashboard/categories',
  // ratings
  ratingsCreate: apiUrl + 'ratings/create',
  ratingsUpdate: apiUrl + 'ratings/update',
  ratingsRetrieve: apiUrl + 'ratings/retrieve',
  ratingsMerchantRetrieve: apiUrl + 'merchants/retrieve_with_rating',
  // valid-id
  getValidID: apiUrl + 'payloads/get_valid_id',
  uploadValidID: apiUrl + 'payloads/upload_valid_id',
  //Agricord-Tasks
  tasksRetrieve: apiUrl + 'paddocks/retrieve_batches_and_paddocks',
  ordersRetrieve: apiUrl + 'order_requests/retrieve',
  ordersRetrieveMerchant: apiUrl + 'order_requests/retrieve_orders',
  ordersRetrieveByParams: apiUrl + 'order_requests/retrieve_orders_by_params',
  sprayMixesRetrieve: apiUrl + 'spray_mixes/retrieve_details',
  orderRequest: apiUrl + 'order_request_items/retrieve',
  paddockDetailsRetrieve: apiUrl + 'paddocks/retrieve',
  paddocksRetrieveWithSprayMix: apiUrl + 'paddocks/retrieve_with_spray_mix',
  // Inventory
  inventoryRetrieve: apiUrl + 'transfers/retrieve_products_first_level',

  // batches
  batchesRetrieveApplyTasks: apiUrl + 'batches/retrieve_apply_tasks',

  //tasks
  paddockPlanTasksRetrieve: apiUrl + 'paddock_plan_tasks/retrieve_mobile_by_params',
  paddockPlanTasksRetrieveAvailablePaddocks: apiUrl + 'paddock_plan_tasks/retrieve_available_paddocks',

  // spray mix products
  sprayMixProductsRetrieve: apiUrl + 'spray_mix_products/retrieve_by_params',
  commentsRetrieve: apiUrl + 'comments/retrieve',
  commentsCreate: apiUrl + 'comments/create',
  commentRepliesCreate: apiUrl + 'comment_replies/create',
  merchantsRetrieve: apiUrl + 'merchants/retrieve_merchants',
  productsRetrieve: apiUrl + 'products/retrieve',
  topChoiceRetrieve: apiUrl + 'top_choices/retrieve',
  topChoiceCreate: apiUrl + 'top_choices/create',
  topChoiceDelete: apiUrl + 'top_choices/delete',
  circleRetrieve: apiUrl + 'my_circles/retrieve',
  circleUpdate: apiUrl + 'my_circles/update',
  circleCreate: apiUrl + 'my_circles/create',
  circleDelete: apiUrl + 'my_circles/delete',
  otherAccountsRetrieve: apiUrl + 'my_circles/retrieve_other_accounts',
  retrieveSavedAddresses: apiUrl + 'locations/retrieve',
  addAddress: apiUrl + 'locations/create',
  removeAddress: apiUrl + 'locations/delete',
  synqtCreate: apiUrl + 'synqts/create',
  synqtRetrieve: apiUrl + 'synqts/retrieve',
  reservationCreate: apiUrl + 'reservations/create',
  reservationRetrieve: apiUrl + 'reservations/retrieve',
  reservationDelete: apiUrl + 'reservations/delete',
  reservationUpdate: apiUrl + 'reservations/update',
};
