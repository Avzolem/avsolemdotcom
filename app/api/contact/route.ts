import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Tipos para el formulario de contacto
interface ContactFormData {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
    message: string;
}

// Configuración del transporter de nodemailer
const createTransporter = () => {
    // Para desarrollo, puedes usar Ethereal Email (servicio de pruebas)
    // Para producción, usa un servicio real como Gmail, SendGrid, etc.
    
    if (process.env.NODE_ENV === 'development') {
        // Para desarrollo - usar consola
        return null;
    }
    
    // Para producción - configurar con variables de entorno
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });
};

export async function POST(request: NextRequest) {
    try {
        const data: ContactFormData = await request.json();
        
        // Validación básica
        if (!data.firstName || !data.lastName || !data.email || !data.message) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos' },
                { status: 400 }
            );
        }
        
        // Validar formato de email
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(data.email)) {
            return NextResponse.json(
                { error: 'Email inválido' },
                { status: 400 }
            );
        }
        
        const transporter = createTransporter();
        
        // Preparar el contenido del email
        const mailOptions = {
            from: process.env.SMTP_FROM || '"Avsolem Contact Form" <noreply@avsolem.com>',
            to: process.env.CONTACT_EMAIL || 'andresaguilar.exe@gmail.com',
            subject: `Nuevo mensaje de contacto de ${data.firstName} ${data.lastName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
                        Nuevo Mensaje de Contacto
                    </h2>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Nombre:</strong> ${data.firstName} ${data.lastName}</p>
                        <p><strong>Empresa:</strong> ${data.company}</p>
                        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                        <p><strong>Teléfono:</strong> ${data.phone}</p>
                    </div>
                    
                    <div style="background-color: #fff; padding: 20px; border-left: 4px solid #f59e0b;">
                        <h3 style="color: #333; margin-top: 0;">Mensaje:</h3>
                        <p style="color: #666; line-height: 1.6;">
                            ${data.message.replace(/\n/g, '<br>')}
                        </p>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
                        <p>Este mensaje fue enviado desde el formulario de contacto de avsolem.com</p>
                        <p>Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</p>
                    </div>
                </div>
            `,
            text: `
                Nuevo Mensaje de Contacto
                
                Nombre: ${data.firstName} ${data.lastName}
                Empresa: ${data.company}
                Email: ${data.email}
                Teléfono: ${data.phone}
                
                Mensaje:
                ${data.message}
                
                ---
                Este mensaje fue enviado desde el formulario de contacto de avsolem.com
                Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
            `
        };
        
        // Email de confirmación para el usuario
        const confirmationMailOptions = {
            from: process.env.SMTP_FROM || '"Avsolem" <noreply@avsolem.com>',
            to: data.email,
            subject: 'Hemos recibido tu mensaje - Avsolem',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
                        ¡Gracias por contactarnos!
                    </h2>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Hola ${data.firstName},
                    </p>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.
                    </p>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333;">Tu mensaje:</h3>
                        <p style="color: #666; line-height: 1.6;">
                            ${data.message.replace(/\n/g, '<br>')}
                        </p>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Saludos,<br>
                        <strong>El equipo de Avsolem</strong>
                    </p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
                        <p>Este es un mensaje automático, por favor no respondas a este email.</p>
                    </div>
                </div>
            `
        };
        
        if (transporter) {
            // Enviar emails en producción
            await transporter.sendMail(mailOptions);
            await transporter.sendMail(confirmationMailOptions);
        } else {
            // En desarrollo, solo loguear
            console.log('📧 Contact Form Submission:', {
                from: `${data.firstName} ${data.lastName} <${data.email}>`,
                company: data.company,
                phone: data.phone,
                message: data.message,
                timestamp: new Date().toISOString()
            });
        }
        
        // Guardar en base de datos si está configurada MongoDB
        if (process.env.MONGODB_URI) {
            try {
                const { MongoClient } = await import('mongodb');
                const client = new MongoClient(process.env.MONGODB_URI);
                await client.connect();
                
                const db = client.db('avsolem');
                const collection = db.collection('contact_submissions');
                
                await collection.insertOne({
                    ...data,
                    createdAt: new Date(),
                    status: 'pending'
                });
                
                await client.close();
            } catch (dbError) {
                console.error('Error saving to database:', dbError);
                // No fallar la request si la DB falla
            }
        }
        
        return NextResponse.json(
            { 
                success: true, 
                message: 'Mensaje enviado correctamente',
                data: {
                    name: `${data.firstName} ${data.lastName}`,
                    email: data.email
                }
            },
            { status: 200 }
        );
        
    } catch (error) {
        console.error('Error processing contact form:', error);
        return NextResponse.json(
            { 
                error: 'Error al procesar el formulario',
                details: process.env.NODE_ENV === 'development' ? error : undefined
            },
            { status: 500 }
        );
    }
}