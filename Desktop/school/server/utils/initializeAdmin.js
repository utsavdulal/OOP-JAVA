const Admin = require('../models/Admin');

const initializeDefaultAdmin = async () => {
  try {
    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      console.log('\n⚠️  NO ADMIN ACCOUNTS FOUND');
      console.log('📝 To create your first admin account, use the registration endpoint:');
      console.log('   POST /api/v1/admin/auth/register');
      console.log('\n📋 Requirements:');
      console.log('   - Email: valid email address');
      console.log('   - Password: Min 8 chars, must include uppercase, lowercase, number, and special char (@$!%*?&)');
      console.log('   - First Name: required');
      console.log('   - Last Name: required');
      console.log('\n✅ Once created, use /api/v1/admin/auth/login to authenticate\n');
    } else {
      console.log(`✅ Admin accounts exist (${adminCount} found)`);
    }
  } catch (error) {
    console.error('❌ Error checking admin accounts:', error.message);
  }
};

module.exports = initializeDefaultAdmin;
