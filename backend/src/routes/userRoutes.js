const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);