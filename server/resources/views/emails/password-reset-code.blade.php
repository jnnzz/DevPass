<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Code</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">DevPass</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Password Reset Code</p>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
        <p>Hello {{ $name }},</p>
        
        <p>You have requested to reset your password. Use the following code to reset your password:</p>
        
        <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h2 style="color: #667eea; font-size: 32px; letter-spacing: 5px; margin: 0; font-family: 'Courier New', monospace;">
                {{ $code }}
            </h2>
        </div>
        
        <p style="color: #666; font-size: 14px;">
            <strong>This code will expire in 15 minutes.</strong>
        </p>
        
        <p style="color: #666; font-size: 14px;">
            If you did not request this password reset, please ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            © {{ date('Y') }} DevPass. All rights reserved.
        </p>
    </div>
</body>
</html>

