<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genkit-ai/flow](./flow.md)

## flow package

## Classes

<table><thead><tr><th>

Class


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[FirestoreStateStore](./flow.firestorestatestore.md)


</td><td>

Implementation of flow state store that persistes flow state in Firestore.


</td></tr>
<tr><td>

[Flow](./flow.flow.md)


</td><td>


</td></tr>
</tbody></table>

## Functions

<table><thead><tr><th>

Function


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[defineFlow(config, steps)](./flow.defineflow.md)


</td><td>

Defines the flow.


</td></tr>
<tr><td>

[getFlowAuth()](./flow.getflowauth.md)


</td><td>

Gets the auth object from the current context.


</td></tr>
<tr><td>

[run(name, func)](./flow.run.md)


</td><td>


</td></tr>
<tr><td>

[run(name, input, func)](./flow.run_1.md)


</td><td>


</td></tr>
<tr><td>

[runAction(action, input)](./flow.runaction.md)


</td><td>

A flow steap that executes an action with provided input and memoizes the output.


</td></tr>
<tr><td>

[runFlow(flow, payload, opts)](./flow.runflow.md)


</td><td>

Runs the flow. If the flow does not get interrupted may return a completed (done=true) operation.


</td></tr>
<tr><td>

[runMap(stepName, input, fn)](./flow.runmap.md)


</td><td>

A helper that takes an array of inputs and maps each input to a run step.


</td></tr>
<tr><td>

[startFlowsServer(params)](./flow.startflowsserver.md)


</td><td>


</td></tr>
<tr><td>

[streamFlow(flow, payload)](./flow.streamflow.md)


</td><td>

Runs the flow and streams results. If the flow does not get interrupted may return a completed (done=true) operation.


</td></tr>
</tbody></table>

## Interfaces

<table><thead><tr><th>

Interface


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[\_\_RequestWithAuth](./flow.__requestwithauth.md)


</td><td>

For express-based flows, req.auth should contain the value to bepassed into the flow context.


</td></tr>
<tr><td>

[FlowAuthPolicy](./flow.flowauthpolicy.md)


</td><td>

Flow Auth policy. Consumes the authorization context of the flow and performs checks before the flow runs. If this throws, the flow will not be executed.


</td></tr>
<tr><td>

[FlowWrapper](./flow.flowwrapper.md)


</td><td>


</td></tr>
</tbody></table>

## Variables

<table><thead><tr><th>

Variable


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[FlowInvokeEnvelopeMessageSchema](./flow.flowinvokeenvelopemessageschema.md)


</td><td>

The message format used by the flow task queue and control interface.


</td></tr>
</tbody></table>

## Type Aliases

<table><thead><tr><th>

Type Alias


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[FlowInvokeEnvelopeMessage](./flow.flowinvokeenvelopemessage.md)


</td><td>


</td></tr>
<tr><td>

[StepsFunction](./flow.stepsfunction.md)


</td><td>


</td></tr>
</tbody></table>