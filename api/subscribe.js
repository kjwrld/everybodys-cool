const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: process.env.VITE_MAILCHIMP_API_KEY,
  server: process.env.VITE_MAILCHIMP_SERVER_PREFIX || 'us1',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, firstName, lastName, tags = [] } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const listId = process.env.VITE_MAILCHIMP_LIST_ID;
    if (!listId) {
      return res.status(500).json({ message: 'Mailchimp list ID not configured' });
    }

    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName || '',
        LNAME: lastName || '',
      },
      tags: tags.length > 0 ? tags : ['fundraiser-donor'],
    });

    res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter',
      id: response.id 
    });
  } catch (error) {
    console.error('Mailchimp error:', error);
    
    if (error.status === 400 && error.response?.body?.title === 'Member Exists') {
      return res.status(200).json({ 
        success: true, 
        message: 'Email already subscribed',
        alreadyExists: true 
      });
    }

    res.status(500).json({ 
      message: 'Error subscribing to newsletter',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}