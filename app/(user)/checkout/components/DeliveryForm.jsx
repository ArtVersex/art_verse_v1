"use client"

import { useState, useEffect } from "react";
import { useUser } from "@/lib/firestore/user/read";
import { addAddress, setDefaultAddress } from "@/lib/firestore/user/write";

export default function DeliveryForm({ 
  setStep, 
  userId, 
  deliveryData, 
  onDeliveryDataChange,
  sameBillingAddress, 
  setSameBillingAddress,
  isWhatsapp,
  setIsWhatsapp 
}) {
  const { user: userData } = useUser(userId);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [saveAddress, setSaveAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  console.log('DeliveryForm userData:', userData);
  
  // Communication preference state
  const [communicationPreference, setCommunicationPreference] = useState('phone');
  const [communicationContacts, setCommunicationContacts] = useState({
    phone: '',
    whatsapp: '',
    email: ''
  });

  // Load user's saved addresses
  useEffect(() => {
    if (userData?.addresses && userData.addresses.length > 0) {
      const defaultAddress = userData.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setUseNewAddress(false);
        // Populate form with default address
        onDeliveryDataChange({
          ...deliveryData,
          firstName: defaultAddress.name.split(' ')[0] || '',
          lastName: defaultAddress.name.split(' ').slice(1).join(' ') || '',
          address: defaultAddress.street,
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipCode: defaultAddress.zipCode,
          phone: defaultAddress.phone
        });
        if (defaultAddress.contactMethod) {
          setCommunicationPreference(defaultAddress.contactMethod);
          setIsWhatsapp(defaultAddress.contactMethod === 'whatsapp');
          
          // Update communication contacts
          if (defaultAddress.contactVia) {
            setCommunicationContacts(prev => ({
              ...prev,
              [defaultAddress.contactMethod]: defaultAddress.contactVia
            }));
          }
        }
      }
    }      
  }, [userData]);

  // Update communication contacts when delivery data changes
  useEffect(() => {
    setCommunicationContacts(prev => ({
      ...prev,
      phone: deliveryData.phone || '',
      whatsapp: deliveryData.phone || '', // Default WhatsApp to phone number
      email: userData?.email || '' // Get email from user data
    }));
  }, [deliveryData.phone, userData?.email]);

  const handleInputChange = (field, value) => {
    const newData = { ...deliveryData, [field]: value };
    onDeliveryDataChange(newData);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleBillingInputChange = (field, value) => {
    const newData = {
      ...deliveryData,
      billingAddress: {
        ...deliveryData.billingAddress,
        [field]: value
      }
    };
    onDeliveryDataChange(newData);
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    if (addressId && !useNewAddress) {
      const selectedAddress = userData.addresses.find(addr => addr.id === addressId);
      if (selectedAddress) {
        onDeliveryDataChange({
          ...deliveryData,
          firstName: selectedAddress.name.split(' ')[0] || '',
          lastName: selectedAddress.name.split(' ').slice(1).join(' ') || '',
          address: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          phone: selectedAddress.phone
        });
        // Load communication preferences from selected address
        if (selectedAddress.contactMethod) {
          setCommunicationPreference(selectedAddress.contactMethod);
          setIsWhatsapp(selectedAddress.contactMethod === 'whatsapp');
          
          if (selectedAddress.contactVia) {
            setCommunicationContacts(prev => ({
              ...prev,
              [selectedAddress.contactMethod]: selectedAddress.contactVia
            }));
          }
        }
      }
    }
  };

  const handleCommunicationPreferenceChange = (preference) => {
    setCommunicationPreference(preference);
    // Update the legacy isWhatsapp prop for backward compatibility
    setIsWhatsapp(preference === 'whatsapp');
    
    // Update delivery data with communication preference
    onDeliveryDataChange({
      ...deliveryData,
      communicationPreference: preference,
      communicationContact: communicationContacts[preference]
    });
  };

  const handleCommunicationContactChange = (type, value) => {
    const newContacts = { ...communicationContacts, [type]: value };
    setCommunicationContacts(newContacts);
    
    // Update delivery data if this is the selected communication method
    if (communicationPreference === type) {
      onDeliveryDataChange({
        ...deliveryData,
        communicationPreference: communicationPreference,
        communicationContact: value
      });
    }

    // Clear error when user starts typing
    if (errors.communicationContact) {
      setErrors(prev => ({ ...prev, communicationContact: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!deliveryData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!deliveryData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!deliveryData.address.trim()) newErrors.address = 'Address is required';
    if (!deliveryData.city.trim()) newErrors.city = 'City is required';
    if (!deliveryData.state.trim()) newErrors.state = 'State is required';
    if (!deliveryData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!deliveryData.phone.trim()) newErrors.phone = 'Phone number is required';

    // Validate communication contact
    const currentContact = communicationContacts[communicationPreference];
    if (!currentContact.trim()) {
      newErrors.communicationContact = `${communicationPreference.charAt(0).toUpperCase() + communicationPreference.slice(1)} contact is required`;
    }

    // Validate billing address if different
    if (!sameBillingAddress) {
      if (!deliveryData.billingAddress.firstName.trim()) newErrors.billingFirstName = 'Billing first name is required';
      if (!deliveryData.billingAddress.lastName.trim()) newErrors.billingLastName = 'Billing last name is required';
      if (!deliveryData.billingAddress.address.trim()) newErrors.billingAddress = 'Billing address is required';
      if (!deliveryData.billingAddress.city.trim()) newErrors.billingCity = 'Billing city is required';
      if (!deliveryData.billingAddress.state.trim()) newErrors.billingState = 'Billing state is required';
      if (!deliveryData.billingAddress.zipCode.trim()) newErrors.billingZipCode = 'Billing ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAndContinue = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Save address if user wants to save it
      if (saveAddress && useNewAddress) {
        // Get the current contact value for the selected communication preference
        const currentContactValue = communicationContacts[communicationPreference];
        
        const addressData = {
          name: `${deliveryData.firstName} ${deliveryData.lastName}`,
          street: deliveryData.address,
          city: deliveryData.city,
          state: deliveryData.state,
          zipCode: deliveryData.zipCode,
          country: 'US', // You might want to add country selection
          phone: deliveryData.phone,
          type: 'shipping',
          isDefault: userData?.addresses?.length === 0, // Make it default if it's the first address
          contactMethod: communicationPreference, // 'phone', 'whatsapp', or 'email'
          contactVia: currentContactValue // Use the current contact value from state
        };

        console.log('Saving address with contactVia:', addressData.contactVia); // Debug log
        await addAddress(userId, addressData);
      }

      // Set billing address same as shipping if selected
      if (sameBillingAddress) {
        onDeliveryDataChange({
          ...deliveryData,
          billingAddress: {
            firstName: deliveryData.firstName,
            lastName: deliveryData.lastName,
            address: deliveryData.address,
            city: deliveryData.city,
            state: deliveryData.state,
            zipCode: deliveryData.zipCode
          },
          communicationPreference,
          communicationContact: communicationContacts[communicationPreference]
        });
      } else {
        // Even if billing is different, still update communication preferences
        onDeliveryDataChange({
          ...deliveryData,
          communicationPreference,
          communicationContact: communicationContacts[communicationPreference]
        });
      }

      setStep('payment');
    } catch (error) {
      console.error('Error saving address:', error);
      // You might want to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
          1
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Delivery Information</h2>
      </div>

      {/* Saved Addresses Section */}
      {userData?.addresses && userData.addresses.length > 0 && (
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                checked={!useNewAddress}
                onChange={() => setUseNewAddress(false)}
                className="mr-3 text-indigo-600"
              />
              <span className="text-gray-700">Use saved address</span>
            </label>

            {!useNewAddress && (
              <div className="ml-6 space-y-2">
                {userData.addresses.map((address) => (
                  <label key={address.id} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="savedAddress"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => handleAddressSelect(address.id)}
                      className="mr-3 mt-1 text-indigo-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{address.name}</div>
                      <div className="text-sm text-gray-600">
                        {address.street}, {address.city}, {address.state} {address.zipCode}
                      </div>
                      {address.phone && (
                        <div className="text-sm text-gray-600">{address.phone}</div>
                      )}
                      {address.isDefault && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            <label className="flex items-center">
              <input
                type="radio"
                checked={useNewAddress}
                onChange={() => setUseNewAddress(true)}
                className="mr-3 text-indigo-600"
              />
              <span className="text-gray-700">Use new address</span>
            </label>
          </div>
        </div>
      )}

      {/* New Address Form */}
      {useNewAddress && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={deliveryData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={deliveryData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              value={deliveryData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your street address"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={deliveryData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="City"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={deliveryData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="State"
              />
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                value={deliveryData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ZIP Code"
              />
              {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={deliveryData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Save Address Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="saveAddress"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
              className="mr-3 text-indigo-600 rounded"
            />
            <label htmlFor="saveAddress" className="text-sm text-gray-700">
              Save this address for future orders
            </label>
          </div>
        </div>
      )}

      {/* Billing Address Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="sameBilling"
            checked={sameBillingAddress}
            onChange={(e) => setSameBillingAddress(e.target.checked)}
            className="mr-3 text-indigo-600 rounded"
          />
          <label htmlFor="sameBilling" className="text-sm text-gray-700">
            Same as delivery address
          </label>
        </div>

        {!sameBillingAddress && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={deliveryData.billingAddress.firstName}
                  onChange={(e) => handleBillingInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.billingFirstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Billing first name"
                />
                {errors.billingFirstName && <p className="text-red-500 text-sm mt-1">{errors.billingFirstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={deliveryData.billingAddress.lastName}
                  onChange={(e) => handleBillingInputChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.billingLastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Billing last name"
                />
                {errors.billingLastName && <p className="text-red-500 text-sm mt-1">{errors.billingLastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                value={deliveryData.billingAddress.address}
                onChange={(e) => handleBillingInputChange('address', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.billingAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Billing street address"
              />
              {errors.billingAddress && <p className="text-red-500 text-sm mt-1">{errors.billingAddress}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={deliveryData.billingAddress.city}
                  onChange={(e) => handleBillingInputChange('city', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.billingCity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Billing city"
                />
                {errors.billingCity && <p className="text-red-500 text-sm mt-1">{errors.billingCity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={deliveryData.billingAddress.state}
                  onChange={(e) => handleBillingInputChange('state', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.billingState ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Billing state"
                />
                {errors.billingState && <p className="text-red-500 text-sm mt-1">{errors.billingState}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={deliveryData.billingAddress.zipCode}
                  onChange={(e) => handleBillingInputChange('zipCode', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.billingZipCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Billing ZIP code"
                />
                {errors.billingZipCode && <p className="text-red-500 text-sm mt-1">{errors.billingZipCode}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Communication Preference Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Preference</h3>
        <p className="text-sm text-gray-600 mb-4">Choose how you'd like to receive order updates</p>
        
        <div className="space-y-4">
          {/* Communication Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Phone Option */}
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              communicationPreference === 'phone' 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="communicationPreference"
                value="phone"
                checked={communicationPreference === 'phone'}
                onChange={(e) => handleCommunicationPreferenceChange(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  communicationPreference === 'phone' 
                    ? 'border-indigo-500' 
                    : 'border-gray-300'
                }`}>
                  {communicationPreference === 'phone' && (
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">📞 Phone</div>
                  <div className="text-sm text-gray-600">Call updates</div>
                </div>
              </div>
            </label>

            {/* WhatsApp Option */}
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              communicationPreference === 'whatsapp' 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="communicationPreference"
                value="whatsapp"
                checked={communicationPreference === 'whatsapp'}
                onChange={(e) => handleCommunicationPreferenceChange(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  communicationPreference === 'whatsapp' 
                    ? 'border-indigo-500' 
                    : 'border-gray-300'
                }`}>
                  {communicationPreference === 'whatsapp' && (
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">💬 WhatsApp</div>
                  <div className="text-sm text-gray-600">Message updates</div>
                </div>
              </div>
            </label>

            {/* Email Option */}
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              communicationPreference === 'email' 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="communicationPreference"
                value="email"
                checked={communicationPreference === 'email'}
                onChange={(e) => handleCommunicationPreferenceChange(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  communicationPreference === 'email' 
                    ? 'border-indigo-500' 
                    : 'border-gray-300'
                }`}>
                  {communicationPreference === 'email' && (
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">📧 Email</div>
                  <div className="text-sm text-gray-600">Email updates</div>
                </div>
              </div>
            </label>
          </div>

          {/* Contact Input Field */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {communicationPreference === 'phone' && 'Phone Number *'}
              {communicationPreference === 'whatsapp' && 'WhatsApp Number *'}
              {communicationPreference === 'email' && 'Email Address *'}
            </label>
            <input
              type={communicationPreference === 'email' ? 'email' : 'tel'}
              value={communicationContacts[communicationPreference]}
              onChange={(e) => handleCommunicationContactChange(communicationPreference, e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.communicationContact ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={
                communicationPreference === 'phone' ? 'Enter your phone number' :
                communicationPreference === 'whatsapp' ? 'Enter your WhatsApp number' :
                'Enter your email address'
              }
            />
            {errors.communicationContact && (
              <p className="text-red-500 text-sm mt-1">{errors.communicationContact}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {communicationPreference === 'phone' && 'We\'ll call you with order updates'}
              {communicationPreference === 'whatsapp' && 'We\'ll send WhatsApp messages for order updates'}
              {communicationPreference === 'email' && 'We\'ll send email notifications for order updates'}
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveAndContinue}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Continue to Payment'}
        </button>
      </div>
    </div>
  );
}