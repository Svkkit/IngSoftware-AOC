"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Users, Percent, Split, Trash2, Eye } from "lucide-react";
import { usePOS, type OrderItem } from "@/contexts/pos-context";

export default function TableManagement() {
  const { state, dispatch } = usePOS();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [discountAmount, setDiscountAmount] = useState<string>("");
  const [discountReason, setDiscountReason] = useState<string>("");
  const [splitCount, setSplitCount] = useState<string>("2");
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isSplitDialogOpen, setIsSplitDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const selectedTableData = state.tables.find((t) => t.id === selectedTable);

  const addOrderToTable = () => {
    if (!selectedTable || !selectedProduct || !quantity) return;

    const product = state.products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const orderItem: OrderItem = {
      productId: product.id,
      productName: product.name,
      quantity: Number.parseInt(quantity),
      unitPrice: product.price,
      total: product.price * Number.parseInt(quantity),
      orderedAt: new Date(),
    };

    dispatch({ type: "ADD_ORDER_TO_TABLE", tableId: selectedTable, orderItem });
    setSelectedProduct("");
    setQuantity("1");
    setIsOrderDialogOpen(false);
  };

  const removeOrderFromTable = (productId: string) => {
    if (!selectedTable) return;
    dispatch({
      type: "REMOVE_ORDER_FROM_TABLE",
      tableId: selectedTable,
      productId,
    });
  };

  const applyDiscount = () => {
    if (!selectedTable || !discountAmount) return;
    dispatch({
      type: "APPLY_DISCOUNT",
      tableId: selectedTable,
      discount: Number.parseFloat(discountAmount),
      reason: discountReason,
    });
    setDiscountAmount("");
    setDiscountReason("");
    setIsDiscountDialogOpen(false);
  };

  const splitBill = () => {
    if (!selectedTable || !splitCount) return;
    dispatch({
      type: "SPLIT_BILL",
      tableId: selectedTable,
      splitCount: Number.parseInt(splitCount),
    });
    setSplitCount("2");
    setIsSplitDialogOpen(false);
  };

  const cleanTable = (tableId: string) => {
    dispatch({ type: "SET_TABLE_STATUS", tableId, status: "available" });
  };

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "occupied":
        return "destructive";
      case "waiting_cleaning":
        return "secondary";
      default:
        return "default";
    }
  };

  const getTableStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible";
      case "occupied":
        return "Ocupada";
      case "waiting_cleaning":
        return "Esperando Limpieza";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {state.tables.map((table) => (
          <Card
          style={{ minHeight: "154px" }}
            key={table.id}
            className={`cursor-pointer transition-all ${
              selectedTable === table.id ? "ring-2 ring-primary" : ""
            } ${
              table.status === "occupied"
                ? "border-color-1 bg-color-1/10"
                : table.status === "waiting_cleaning"
                ? "border-color-4 bg-color-4/10"
                : "border-color-2 bg-color-2/10"
            }`}
            onClick={() => setSelectedTable(table.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                Mesa {table.number}
                <Users className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={
                  table.status === "occupied"
                    ? "default"
                    : table.status === "waiting_cleaning"
                    ? "secondary"
                    : "outline"
                }
                className={
                  table.status === "occupied"
                    ? "bg-color-danger text-white"
                    : table.status === "waiting_cleaning"
                    ? "bg-color-4 text-gray-800"
                    : "bg-color-1 text-white"
                }
              >
                {getTableStatusText(table.status)}
              </Badge>
              {table.orders.length > 0 && (
                <div className="text-sm space-y-1">
                  <p>{table.orders.length} producto(s)</p>
                  <p className="font-medium">
                    Total: ${table.total.toFixed(2)}
                  </p>
                  {table.discount > 0 && (
                    <p className="text-color-5">
                      Descuento: -${table.discount.toFixed(2)}
                    </p>
                  )}
                  {table.splitBill && (
                    <p className="text-color-1">
                      Dividida en {table.splitCount}
                    </p>
                  )}
                </div>
              )}
              {table.status === "waiting_cleaning" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2 bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    cleanTable(table.id);
                  }}
                >
                  Limpiar Mesa
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTableData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Mesa {selectedTableData.number} - Gestión de Cuenta</span>
              <div className="flex gap-2">
                <Dialog
                  open={isViewDialogOpen}
                  onOpenChange={setIsViewDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        Detalle de Cuenta - Mesa {selectedTableData.number}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio Unit.</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Hora</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedTableData.orders.map((order, index) => (
                            <TableRow key={index}>
                              <TableCell>{order.productName}</TableCell>
                              <TableCell>{order.quantity}</TableCell>
                              <TableCell>
                                ${order.unitPrice.toFixed(2)}
                              </TableCell>
                              <TableCell>${order.total.toFixed(2)}</TableCell>
                              <TableCell>
                                {order.orderedAt.toLocaleTimeString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>
                            $
                            {selectedTableData.orders
                              .reduce((sum, order) => sum + order.total, 0)
                              .toFixed(2)}
                          </span>
                        </div>
                        {selectedTableData.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>
                              Descuento ({selectedTableData.discountReason}):
                            </span>
                            <span>
                              -${selectedTableData.discount.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>${selectedTableData.total.toFixed(2)}</span>
                        </div>
                        {selectedTableData.splitBill && (
                          <div className="flex justify-between text-blue-600">
                            <span>
                              Por persona ({selectedTableData.splitCount}):
                            </span>
                            <span>
                              $
                              {(
                                selectedTableData.total /
                                (selectedTableData.splitCount || 1)
                              ).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Badge variant={getTableStatusColor(selectedTableData.status)}>
                  {getTableStatusText(selectedTableData.status)}
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              Administra los pedidos y opciones de la mesa seleccionada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Dialog
                open={isOrderDialogOpen}
                onOpenChange={setIsOrderDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    disabled={selectedTableData.status === "waiting_cleaning"}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Agregar Producto a Mesa {selectedTableData.number}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="product">Producto</Label>
                      <Select
                        value={selectedProduct}
                        onValueChange={setSelectedProduct}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {state.products
                            .filter((p) => p.available)
                            .map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} - ${product.price.toFixed(2)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantity">Cantidad</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsOrderDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={addOrderToTable}
                      disabled={!selectedProduct || !quantity}
                    >
                      Agregar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isDiscountDialogOpen}
                onOpenChange={setIsDiscountDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedTableData.orders.length === 0}
                  >
                    <Percent className="h-4 w-4 mr-2" />
                    Aplicar Descuento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Aplicar Descuento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="discount">Monto del Descuento ($)</Label>
                      <Input
                        id="discount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reason">Razón del Descuento</Label>
                      <Textarea
                        id="reason"
                        value={discountReason}
                        onChange={(e) => setDiscountReason(e.target.value)}
                        placeholder="Ej: Promoción especial, cortesía, etc."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDiscountDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={applyDiscount} disabled={!discountAmount}>
                      Aplicar Descuento
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isSplitDialogOpen}
                onOpenChange={setIsSplitDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedTableData.orders.length === 0}
                  >
                    <Split className="h-4 w-4 mr-2" />
                    Dividir Cuenta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dividir Cuenta</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="split-count">Número de Personas</Label>
                      <Input
                        id="split-count"
                        type="number"
                        min="2"
                        max="10"
                        value={splitCount}
                        onChange={(e) => setSplitCount(e.target.value)}
                      />
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">
                        Total actual: ${selectedTableData.total.toFixed(2)}
                      </p>
                      <p className="text-sm font-medium">
                        Por persona: $
                        {(
                          selectedTableData.total /
                          Number.parseInt(splitCount || "1")
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsSplitDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={splitBill} disabled={!splitCount}>
                      Dividir Cuenta
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {selectedTableData.orders.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio Unit.</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTableData.orders.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>${order.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeOrderFromTable(order.productId)}
                          disabled={
                            selectedTableData.status === "waiting_cleaning"
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {selectedTableData.orders.length > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>
                      $
                      {selectedTableData.orders
                        .reduce((sum, order) => sum + order.total, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  {selectedTableData.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento:</span>
                      <span>-${selectedTableData.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${selectedTableData.total.toFixed(2)}</span>
                  </div>
                  {selectedTableData.splitBill && (
                    <div className="flex justify-between text-blue-600">
                      <span>Por persona ({selectedTableData.splitCount}):</span>
                      <span>
                        $
                        {(
                          selectedTableData.total /
                          (selectedTableData.splitCount || 1)
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
