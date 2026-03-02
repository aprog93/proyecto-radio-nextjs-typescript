import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
    Heart,
    CreditCard,
    Bitcoin,
    DollarSign,
    Loader2,
    Check,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PaymentMethod {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    color: string;
}

const Donations = () => {
    const { t } = useTranslation();
    const [selectedAmount, setSelectedAmount] = useState(50000);
    const [customAmount, setCustomAmount] = useState("");
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [donorName, setDonorName] = useState("");
    const [donorEmail, setDonorEmail] = useState("");

    const predefinedAmounts = [10000, 25000, 50000, 100000];

    const paymentMethods: PaymentMethod[] = [
        {
            id: "paypal",
            name: "PayPal",
            icon: <DollarSign className="w-8 h-8" />,
            description: "Paga de forma segura con tu cuenta de PayPal",
            color: "from-blue-500 to-blue-600",
        },
        {
            id: "card",
            name: "Tarjeta de Crédito/Débito",
            icon: <CreditCard className="w-8 h-8" />,
            description: "Visa, Mastercard, American Express",
            color: "from-purple-500 to-pink-600",
        },
        {
            id: "crypto",
            name: "Criptomonedas",
            icon: <Bitcoin className="w-8 h-8" />,
            description: "Bitcoin, Ethereum, Stablecoin",
            color: "from-yellow-500 to-orange-600",
        },
        {
            id: "bank",
            name: "Transferencia Bancaria",
            icon: <DollarSign className="w-8 h-8" />,
            description: "Transferencia directa a nuestra cuenta",
            color: "from-green-500 to-emerald-600",
        },
    ];

    const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;

    const handleDonate = async (methodId: string) => {
        if (!donorName.trim() || !donorEmail.trim()) {
            toast.error(
                t("donations.fillAllFields") ||
                    "Por favor completa todos los campos",
            );
            return;
        }

        setSelectedMethod(methodId);
        setIsProcessing(true);

        // Simular procesamiento de pago
        setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
            toast.success(
                t("donations.thankYou") ||
                    `¡Gracias ${donorName}! Tu donación de COP$${finalAmount.toLocaleString()} ha sido procesada.`,
            );

            // Reset form después de 3 segundos
            setTimeout(() => {
                setShowSuccess(false);
                setDonorName("");
                setDonorEmail("");
                setCustomAmount("");
                setSelectedAmount(50000);
                setSelectedMethod(null);
            }, 3000);
        }, 2000);
    };

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="container mx-auto max-w-5xl">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="flex justify-center mb-4">
                        <Heart className="w-16 h-16 text-red-500 animate-pulse" />
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                        {t("donations.title") || "¡Apoya Radio Comunitaria!"}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("donations.subtitle") ||
                            "Tu donación nos ayuda a mantener nuestra plataforma de radio comunitaria funcionando y llevar contenido de calidad a nuestra audiencia."}
                    </p>
                </motion.div>

                {/* Why Donate Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                        {t("donations.whyDonate") || "¿Por qué donar?"}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title:
                                    t("donations.reason1Title") ||
                                    "Contenido de Calidad",
                                desc:
                                    t("donations.reason1Desc") ||
                                    "Producimos contenido original y de calidad para nuestra comunidad",
                            },
                            {
                                title:
                                    t("donations.reason2Title") ||
                                    "Infraestructura",
                                desc:
                                    t("donations.reason2Desc") ||
                                    "Mantenemos servidores y equipos de streaming de última generación",
                            },
                            {
                                title:
                                    t("donations.reason3Title") ||
                                    "Creadores Locales",
                                desc:
                                    t("donations.reason3Desc") ||
                                    "Apoyamos a productores, músicos y creadores de contenido local",
                            },
                        ].map((item, i) => (
                            <Card
                                key={i}
                                className="p-6 border border-border bg-card hover:border-primary/50 transition-colors"
                            >
                                <h3 className="font-semibold text-lg text-foreground mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {item.desc}
                                </p>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                {/* Main Donation Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid lg:grid-cols-2 gap-8 mb-8"
                >
                    {/* Left Column - Amount Selection */}
                    <div className="space-y-6">
                        <Card className="p-6 border border-border bg-card">
                            <h3 className="font-semibold text-lg text-foreground mb-4">
                                {t("donations.selectAmount") ||
                                    "Selecciona un monto"}
                            </h3>

                            {/* Predefined amounts */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {predefinedAmounts.map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => {
                                            setSelectedAmount(amount);
                                            setCustomAmount("");
                                        }}
                                        className={`p-3 rounded-lg font-semibold transition-all ${
                                            selectedAmount === amount &&
                                            !customAmount
                                                ? "bg-primary text-primary-foreground scale-105"
                                                : "bg-secondary text-foreground hover:bg-secondary/80"
                                        }`}
                                    >
                                        COP ${(amount / 1000).toFixed(0)}k
                                    </button>
                                ))}
                            </div>

                            {/* Custom amount */}
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">
                                    {t("donations.customAmount") ||
                                        "O ingresa un monto personalizado"}
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold text-foreground">
                                        COP $
                                    </span>
                                    <Input
                                        type="number"
                                        value={customAmount}
                                        onChange={(e) => {
                                            setCustomAmount(e.target.value);
                                        }}
                                        placeholder="0"
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        {t("donations.totalDonation") ||
                                            "Total:"}
                                    </span>
                                    <span className="text-2xl font-bold text-primary">
                                        COP ${finalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Donor Info */}
                    <div className="space-y-6">
                        <Card className="p-6 border border-border bg-card">
                            <h3 className="font-semibold text-lg text-foreground mb-4">
                                {t("donations.donorInfo") || "Tu información"}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">
                                        {t("donations.name") ||
                                            "Nombre (opcional)"}
                                    </label>
                                    <Input
                                        type="text"
                                        value={donorName}
                                        onChange={(e) =>
                                            setDonorName(e.target.value)
                                        }
                                        placeholder={
                                            t("donations.namePlaceholder") ||
                                            "Tu nombre"
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">
                                        {t("donations.email") ||
                                            "Email (para recibo)"}
                                    </label>
                                    <Input
                                        type="email"
                                        value={donorEmail}
                                        onChange={(e) =>
                                            setDonorEmail(e.target.value)
                                        }
                                        placeholder={
                                            t("donations.emailPlaceholder") ||
                                            "tu@email.com"
                                        }
                                    />
                                </div>

                                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <p className="text-sm text-blue-700 dark:text-blue-400">
                                        {t("donations.privacyNote") ||
                                            "💡 Tus datos se mantienen privados y seguros. No compartimos información personal."}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </motion.div>

                {/* Payment Methods */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                        {t("donations.paymentMethods") || "Métodos de Pago"}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        {paymentMethods.map((method) => (
                            <motion.button
                                key={method.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>
                                    !isProcessing &&
                                    !showSuccess &&
                                    handleDonate(method.id)
                                }
                                disabled={isProcessing || showSuccess}
                                className={`relative overflow-hidden p-6 rounded-xl border-2 transition-all ${
                                    selectedMethod === method.id
                                        ? "border-primary bg-primary/10"
                                        : "border-border bg-card hover:border-primary/50"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {/* Background gradient */}
                                <div
                                    className={`absolute inset-0 opacity-0 bg-gradient-to-br ${method.color} transition-opacity ${
                                        selectedMethod === method.id
                                            ? "opacity-5"
                                            : ""
                                    }`}
                                />

                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`p-3 rounded-lg bg-gradient-to-br ${method.color} text-white`}
                                        >
                                            {method.icon}
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-semibold text-foreground">
                                                {method.name}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {method.description}
                                            </p>
                                        </div>
                                    </div>
                                    {isProcessing &&
                                        selectedMethod === method.id && (
                                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                        )}
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Info Message */}
                    <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-center">
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                            {t("donations.mockNote") ||
                                "⚠️ Este es un sistema de donaciones de demostración. Los pagos no se procesarán realmente."}
                        </p>
                    </div>
                </motion.div>

                {/* Success Dialog */}
                <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-full bg-green-500/20 border border-green-500/50">
                                    <Check className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                            <DialogTitle className="text-center text-2xl">
                                {t("donations.successTitle") ||
                                    "¡Gracias por tu donación!"}
                            </DialogTitle>
                            <DialogDescription className="text-center">
                                <div className="mt-4 space-y-2">
                                    <p className="text-lg font-semibold text-foreground">
                                        COP ${finalAmount.toLocaleString()}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {t("donations.successMessage") ||
                                            "Tu donación ha sido procesada exitosamente. Recibirás un recibo en tu email."}
                                    </p>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Donations;
